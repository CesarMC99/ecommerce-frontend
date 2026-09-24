'use client'

import type { MeQuery } from '@/graphql/generated/graphql'
import { ME } from '@/graphql/modules/auth/fragments/me.fragment'
import { LOGOUT } from '@/graphql/modules/auth/mutations/logout.mutation'
import { getAuthToken, setAuthToken } from '@/lib/auth-token'
import { refreshAccessToken } from '@/lib/refresh-access-token'
import { useApolloClient } from '@apollo/client/react'
import { createContext, useContext, useEffect, useState } from 'react'

// El tipo del usuario sale de Codegen (la query Me), no se escribe a mano
export type SessionUser = MeQuery['me']

// 'loading' existe a propósito: al recargar la página NO sabemos todavía si
// hay sesión (hay que preguntarle al backend). Sin este estado, la UI
// mostraría "no logueado" durante un instante y luego cambiaría (parpadeo)
type SessionState =
   | { status: 'loading'; user: null }
   | { status: 'authenticated'; user: SessionUser }
   | { status: 'unauthenticated'; user: null }

interface SessionContextValue {
   status: SessionState['status']
   user: SessionUser | null
   signIn: (accessToken: string, user: SessionUser) => void
   signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: React.PropsWithChildren) {
   const client = useApolloClient()
   const [session, setSession] = useState<SessionState>({
      status: 'loading',
      user: null,
   })

   // Al arrancar la app: ¿hay sesión? El access token vive solo en memoria
   // (se pierde al recargar), pero la cookie httpOnly del refresh token
   // sigue ahí: si el refresh funciona, la sesión se recupera sola
   useEffect(() => {
      // Evita actualizar el estado si el componente se desmontó mientras
      // esperábamos al backend (p. ej. el doble montaje de React en dev)
      let cancelled = false

      const restoreSession = async () => {
         // refreshAccessToken es "single-flight": aunque este efecto se
         // ejecute dos veces seguidas, al backend le llega UN solo refresh
         const token = getAuthToken() ?? (await refreshAccessToken())
         if (!token) {
            if (!cancelled) setSession({ status: 'unauthenticated', user: null })
            return
         }

         try {
            const { data } = await client.query({
               query: ME,
               fetchPolicy: 'network-only',
            })
            if (cancelled) return
            setSession(
               data
                  ? { status: 'authenticated', user: data.me }
                  : { status: 'unauthenticated', user: null },
            )
         } catch {
            setAuthToken(null)
            if (!cancelled) setSession({ status: 'unauthenticated', user: null })
         }
      }

      void restoreSession()
      return () => {
         cancelled = true
      }
   }, [client])

   // Lo llaman login, registro y Google tras autenticarse con éxito
   const signIn = (accessToken: string, user: SessionUser) => {
      setAuthToken(accessToken)
      setSession({ status: 'authenticated', user })
   }

   const signOut = async () => {
      try {
         // El backend revoca el refresh token y borra la cookie
         await client.mutate({ mutation: LOGOUT })
      } finally {
         // `finally`: aunque el backend no responda, en ESTE navegador la
         // sesión se cierra igual. Dejar al usuario "medio logueado" es peor
         setAuthToken(null)
         // Borra de la caché de Apollo todo lo que pertenecía al usuario
         // (si otra persona entra después en este navegador, no lo verá)
         await client.clearStore()
         setSession({ status: 'unauthenticated', user: null })
      }
   }

   return (
      <SessionContext.Provider
         value={{ status: session.status, user: session.user, signIn, signOut }}
      >
         {children}
      </SessionContext.Provider>
   )
}

export function useSession() {
   const context = useContext(SessionContext)
   // Falla ruidosamente si alguien lo usa fuera del provider: mejor un error
   // claro en desarrollo que un `null` silencioso que rompa más adelante
   if (!context) {
      throw new Error('useSession debe usarse dentro de <SessionProvider>')
   }
   return context
}

'use client'

import { useSession, type SessionUser } from '@/providers/SessionProvider'

// Forma común de lo que devuelven login, register y loginWithGoogle
// (las tres mutations piden los mismos campos del AuthPayload)
interface AuthPayload {
   accessToken: string
   user: SessionUser
}

// Lo que pasa DESPUÉS de autenticarse es igual en login, registro y Google.
// Un solo hook evita que los tres flujos acaben comportándose distinto
export function useCompleteAuth() {
   const { signIn } = useSession()

   return ({ accessToken, user }: AuthPayload) => {
      // El refresh token NO se toca: el backend ya lo dejó en la cookie httpOnly.
      // Tampoco se redirige aquí: al pasar la sesión a 'authenticated', el
      // GuestGuard de las páginas de auth saca al usuario a la home. Así la
      // regla "logueado ⇒ fuera del login" vive en UN solo sitio
      signIn(accessToken, user)
   }
}

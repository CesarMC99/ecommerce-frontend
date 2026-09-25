'use client'

import { getSafeRedirect, REDIRECT_PARAM, ROUTES } from '@/lib/routes'
import { useSession } from '@/providers/SessionProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Protege las páginas SOLO para invitados (login, registro): un usuario con
// sesión no tiene nada que hacer aquí. Se le devuelve a la página de la que
// venía (?redirigir=/producto/...) o, si no hay, a la home.
//
// ¿Por qué en el cliente y no en el servidor (proxy.ts)? Porque el servidor
// de Next no puede saber si hay sesión: la cookie del refresh token es
// httpOnly y solo se envía a /graphql del backend, nunca a estas páginas
export function GuestGuard({ children }: React.PropsWithChildren) {
   const { status } = useSession()
   const router = useRouter()

   useEffect(() => {
      if (status !== 'authenticated') return
      // window.location y no useSearchParams: este componente vive en un
      // layout, y ese hook obligaría a envolver las páginas en <Suspense>.
      // getSafeRedirect descarta cualquier destino fuera de la tienda
      const redirectTo = getSafeRedirect(
         new URLSearchParams(window.location.search).get(REDIRECT_PARAM),
      )
      // replace y no push: el login no queda en el historial, así que el
      // botón "atrás" tampoco puede devolver al usuario aquí
      router.replace(redirectTo ?? ROUTES.home)
   }, [status, router])

   // Mientras se comprueba la sesión (o mientras redirige) NO se muestra el
   // formulario: si no, un usuario logueado lo vería parpadear un instante
   if (status !== 'unauthenticated') {
      return (
         <div
            role="status"
            aria-label="Comprobando sesión"
            className="flex min-h-screen items-center justify-center"
         >
            <span className="size-6 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
         </div>
      )
   }

   return children
}

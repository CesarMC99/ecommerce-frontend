'use client'

import { loginRoute } from '@/lib/routes'
import { useSession } from '@/providers/SessionProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Lo contrario de GuestGuard: protege páginas que EXIGEN sesión (checkout,
// y mañana "Mis pedidos"). Un invitado va al login y, al entrar, vuelve
// aquí gracias a ?redirigir=. Igual que GuestGuard, vive en el cliente
// porque el servidor de Next no puede ver la sesión (cookie httpOnly del
// backend). La seguridad REAL está en el backend (JwtAuthGuard): esto
// solo evita mostrar una página que no funcionaría
export function AuthGuard({ children }: React.PropsWithChildren) {
   const { status } = useSession()
   const router = useRouter()

   useEffect(() => {
      if (status !== 'unauthenticated') return
      const { pathname, search } = window.location
      router.replace(loginRoute(pathname + search))
   }, [status, router])

   if (status !== 'authenticated') {
      return (
         <div
            role="status"
            aria-label="Comprobando sesión"
            className="flex justify-center py-32"
         >
            <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
         </div>
      )
   }

   return children
}

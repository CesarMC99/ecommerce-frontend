import { AuthHeroText } from '@/features/(auth)/components/AuthHeroText'
import { ROUTES } from '@/lib/routes'
import Link from 'next/link'

// Diseño de las páginas de cuenta. Lo comparten el login/registro (solo
// invitados) y la recuperación de contraseña (con o sin sesión).
//  - Escritorio (md+): dos columnas, panel naranja + formulario.
//  - Móvil: el panel naranja se oculta (a media pantalla dejaba el
//    formulario en 180 px) y queda una cabecera con el logo
export function AuthShell({ children }: React.PropsWithChildren) {
   return (
      <main className="flex min-h-screen flex-col md:flex-row">
         <header className="border-b border-beige-3/60 px-5 py-4 md:hidden">
            <Link
               href={ROUTES.home}
               className="font-bricolage-extrabold text-xl tracking-[0.18em] text-brown-principal"
            >
               ÁMBAR
            </Link>
         </header>

         {/* sticky + h-screen: el formulario de registro es más alto que la
             pantalla; así el panel naranja se queda fijo mientras el
             formulario hace scroll, en vez de cortarse a media página */}
         <div className="sticky top-0 hidden h-screen basis-1/2 flex-col justify-between px-12 py-14 layout-auth-bg md:flex">
            {/* relative z-10: las líneas decorativas son `absolute inset-0` y,
                sin esto, taparían el enlace y no se podría hacer clic */}
            <Link
               href={ROUTES.home}
               className="relative z-10 w-fit font-bricolage-extrabold text-white text-2xl tracking-[0.18em]"
            >
               ÁMBAR
            </Link>

            <AuthHeroText />

            <div className="layout-auth-bg-lines pointer-events-none"></div>
         </div>

         <div className="flex flex-1 justify-center bg-transparent px-5 py-10 md:basis-1/2 md:items-center md:px-0 md:py-12">
            {children}
         </div>
      </main>
   )
}

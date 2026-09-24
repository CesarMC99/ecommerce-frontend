import { AuthHeroText } from '@/features/(auth)/components/AuthHeroText'
import { GuestGuard } from '@/features/(auth)/shared/GuestGuard'
import { ROUTES } from '@/lib/routes'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      // El guard envuelve TODO el layout: login y registro quedan protegidos
      // a la vez, y cualquier página nueva de este grupo también lo estará
      <GuestGuard>
         <main className="flex min-h-screen">
            {/* sticky + h-screen: el formulario de registro es más alto que la
                pantalla; así el panel naranja se queda fijo mientras el
                formulario hace scroll, en vez de cortarse a media página */}
            <div className="sticky top-0 flex h-screen basis-1/2 flex-col justify-between px-12 py-14 layout-auth-bg">
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

            <div className="basis-1/2 bg-transparent flex justify-center items-center py-12">
               {children}
            </div>
         </main>
      </GuestGuard>
   )
}

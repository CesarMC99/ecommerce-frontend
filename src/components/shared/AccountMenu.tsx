'use client'
// Client Component: depende de la sesión (estado del navegador) y abre un
// menú. El Header sigue siendo de servidor; solo esta "isla" es interactiva

import { ROUTES } from '@/lib/routes'
import { useSession } from '@/providers/SessionProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DropdownMenu } from 'radix-ui'
import { useState } from 'react'
import { SpriteIcon } from './SpriteIcon'

const ICON_CLASS = 'size-[19px]'

const ACCOUNT_LINKS = [
   { href: ROUTES.orders, label: 'Mis pedidos' },
   { href: ROUTES.favorites, label: 'Favoritos' },
]

export function AccountMenu() {
   const { status, user, signOut } = useSession()
   const router = useRouter()
   const [isSigningOut, setIsSigningOut] = useState(false)

   // Mientras se comprueba la sesión se pinta el icono SIN acción: ocupa el
   // mismo espacio, así el header no "salta" cuando llega la respuesta
   if (status === 'loading') {
      return (
         <span
            aria-hidden
            className="text-brown-2 opacity-40"
         >
            <SpriteIcon
               name="profile"
               className={ICON_CLASS}
            />
         </span>
      )
   }

   if (status === 'unauthenticated') {
      return (
         <Link
            href={ROUTES.login}
            aria-label="Iniciar sesión"
            className="transition-opacity hover:opacity-70"
         >
            <SpriteIcon
               name="profile"
               className={ICON_CLASS}
            />
         </Link>
      )
   }

   const handleSignOut = async () => {
      setIsSigningOut(true)
      await signOut()
      // replace: tras cerrar sesión, "atrás" no debe volver a una página
      // que se veía con la sesión abierta
      router.replace(ROUTES.login)
   }

   // Solo el primer nombre: "Hola, Cuenta" cabe mejor que el nombre completo
   const firstName = user?.name.split(' ')[0]

   return (
      <DropdownMenu.Root>
         <DropdownMenu.Trigger
            aria-label="Mi cuenta"
            className="cursor-pointer text-coral-principal transition-opacity outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-coral-principal/40"
         >
            <SpriteIcon
               name="profile"
               className={ICON_CLASS}
            />
         </DropdownMenu.Trigger>

         {/* Portal: el menú se pinta al final del <body>, fuera del header,
             así ningún overflow ni z-index del header lo puede recortar */}
         <DropdownMenu.Portal>
            <DropdownMenu.Content
               align="end"
               sideOffset={12}
               className="z-50 min-w-56 animate-fade-in rounded-md border border-beige-2 bg-neutro-1 p-1.5 shadow-[0_10px_30px_rgba(26,18,13,0.12)]"
            >
               <DropdownMenu.Label className="px-3 py-2.5">
                  <p className="font-bricolage-semibold text-[15px] text-brown-principal">
                     Hola, {firstName}
                  </p>
                  <p className="truncate text-xs text-brown-1">{user?.email}</p>
               </DropdownMenu.Label>

               <DropdownMenu.Separator className="my-1 h-px bg-beige-2" />

               {/* asChild: el Item de Radix "presta" su comportamiento
                   (teclado, foco, cerrar al elegir) al <Link> de Next */}
               {/* TODO(perfil): añadir "Mi cuenta" cuando exista /perfil */}
               {ACCOUNT_LINKS.map((link) => (
                  <DropdownMenu.Item
                     key={link.href}
                     asChild
                  >
                     <Link
                        href={link.href}
                        className="block rounded px-3 py-2 text-[13px] text-brown-2 outline-none data-highlighted:bg-beige-1"
                     >
                        {link.label}
                     </Link>
                  </DropdownMenu.Item>
               ))}

               <DropdownMenu.Separator className="my-1 h-px bg-beige-2" />

               <DropdownMenu.Item
                  disabled={isSigningOut}
                  // onSelect (no onClick): Radix lo dispara también con
                  // teclado (Enter/Espacio), no solo con el ratón
                  onSelect={handleSignOut}
                  className="cursor-pointer rounded px-3 py-2 text-[13px] text-coral-principal outline-none data-disabled:opacity-50 data-highlighted:bg-beige-1"
               >
                  {isSigningOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
               </DropdownMenu.Item>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu.Root>
   )
}

'use client'

import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useSession } from '@/providers/SessionProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { NAV_LINKS } from './nav-links'

// Menú de navegación para pantallas pequeñas (en escritorio no se pinta:
// md:hidden). Es un Dialog de Radix con forma de panel lateral, como el
// carrito: foco atrapado, Escape y clic fuera para cerrar, y el scroll de
// la página bloqueado mientras está abierto, sin programarlo a mano
export function MobileMenu() {
   const [open, setOpen] = useState(false)
   const { status, user, signOut } = useSession()
   const router = useRouter()
   const close = () => setOpen(false)

   const handleSignOut = async () => {
      close()
      await signOut()
      // Igual que el menú de cuenta de escritorio: al login SIN ?redirigir=,
      // así al volver a entrar se va a la página principal
      router.replace(ROUTES.login)
   }

   return (
      <Dialog.Root
         open={open}
         onOpenChange={setOpen}
      >
         <Dialog.Trigger
            aria-label="Abrir menú"
            className="-ml-1 flex size-9 cursor-pointer items-center justify-center rounded-md text-brown-principal md:hidden"
         >
            {/* Icono "hamburguesa": tres líneas */}
            <svg
               aria-hidden
               viewBox="0 0 24 24"
               className="size-[22px]"
               fill="none"
               stroke="currentColor"
               strokeWidth="1.6"
               strokeLinecap="round"
            >
               <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
         </Dialog.Trigger>

         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-brown-principal/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[340px] max-w-[88vw] flex-col bg-neutro-2 shadow-[10px_0_40px_rgba(26,18,13,0.2)] duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left">
               <div className="flex items-center justify-between border-b border-beige-2 px-6 py-5">
                  <Dialog.Title asChild>
                     <Link
                        href={ROUTES.home}
                        onClick={close}
                        className="font-bricolage-extrabold text-xl tracking-[0.18em] text-brown-principal"
                     >
                        ÁMBAR
                     </Link>
                  </Dialog.Title>
                  <Dialog.Close
                     aria-label="Cerrar menú"
                     className="cursor-pointer text-2xl leading-none text-brown-1 hover:text-brown-principal"
                  >
                     ×
                  </Dialog.Close>
               </div>
               <Dialog.Description className="sr-only">
                  Secciones de la tienda y tu cuenta
               </Dialog.Description>

               {/* overflow-y-auto: en móviles muy bajos el menú hace scroll
                   por dentro en vez de cortarse */}
               <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
                  <nav
                     aria-label="Secciones"
                     className="flex flex-col"
                  >
                     {NAV_LINKS.map((link) => (
                        <Link
                           key={link.label}
                           href={link.href}
                           onClick={close}
                           className={cn(
                              'border-b border-beige-2 py-3.5 font-bricolage-semibold text-2xl',
                              link.highlight ? 'text-coral-principal' : 'text-brown-principal',
                           )}
                        >
                           {link.label}
                        </Link>
                     ))}
                     <Link
                        href={ROUTES.catalog}
                        onClick={close}
                        className="py-3.5 text-sm text-brown-2"
                     >
                        Ver todo el catálogo →
                     </Link>
                  </nav>

                  <div className="mt-auto pt-8">
                     <p className="mb-3 text-[11px] tracking-[0.1em] text-brown-1">
                        MI CUENTA
                     </p>
                     {status === 'authenticated' && user ? (
                        <div className="flex flex-col gap-1">
                           <p className="mb-2 font-bricolage-semibold text-lg text-brown-principal">
                              Hola, {user.name.split(' ')[0]}
                           </p>
                           <AccountLink href={ROUTES.profile} onClick={close}>
                              Mi perfil
                           </AccountLink>
                           <AccountLink href={ROUTES.orders} onClick={close}>
                              Mis pedidos
                           </AccountLink>
                           <AccountLink href={ROUTES.favorites} onClick={close}>
                              Favoritos
                           </AccountLink>
                           <button
                              type="button"
                              onClick={handleSignOut}
                              className="mt-2 w-fit cursor-pointer py-2 text-sm text-coral-principal"
                           >
                              Cerrar sesión
                           </button>
                        </div>
                     ) : status === 'unauthenticated' ? (
                        <div className="flex flex-col gap-3">
                           <Link
                              href={ROUTES.login}
                              onClick={close}
                              className="block bg-brown-principal py-3.5 text-center text-[13px] text-neutro-2"
                           >
                              Iniciar sesión
                           </Link>
                           <Link
                              href={ROUTES.register}
                              onClick={close}
                              className="block border border-brown-principal py-3.5 text-center text-[13px] text-brown-principal"
                           >
                              Crear cuenta
                           </Link>
                        </div>
                     ) : null}
                  </div>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

interface AccountLinkProps {
   href: string
   onClick: () => void
}

function AccountLink({
   href,
   onClick,
   children,
}: React.PropsWithChildren<AccountLinkProps>) {
   return (
      <Link
         href={href}
         onClick={onClick}
         className="py-2 text-sm text-brown-2 hover:text-brown-principal"
      >
         {children}
      </Link>
   )
}

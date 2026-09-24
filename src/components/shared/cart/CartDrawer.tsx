'use client'

import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/format-price'
import { ROUTES } from '@/lib/routes'
import { useCartStore } from '@/stores/cart-store'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { CartLineItem } from './CartLineItem'
import { FreeShippingProgress } from './FreeShippingProgress'

// Panel lateral del carrito. Se abre al añadir un producto o al pulsar la
// bolsa del header. Es un Dialog de Radix con forma de panel: hereda todo
// lo accesible de un modal (foco atrapado, Escape, clic fuera, scroll del
// fondo bloqueado) sin programarlo a mano
export function CartDrawer() {
   const isOpen = useCartStore((state) => state.isDrawerOpen)
   const setDrawerOpen = useCartStore((state) => state.setDrawerOpen)
   const { cart, itemCount, isReady, setQuantity, removeItem } = useCart()

   const closeDrawer = () => setDrawerOpen(false)
   const lines = cart?.lines ?? []

   return (
      <Dialog.Root
         open={isOpen}
         onOpenChange={setDrawerOpen}
      >
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-brown-principal/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[420px] max-w-[92vw] flex-col bg-neutro-2 shadow-[-10px_0_40px_rgba(26,18,13,0.2)] duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
               <div className="flex items-center justify-between border-b border-beige-2 px-7 py-6">
                  <Dialog.Title className="font-bricolage-semibold text-xl text-brown-principal">
                     Tu carrito ({itemCount})
                  </Dialog.Title>
                  <Dialog.Close
                     aria-label="Cerrar carrito"
                     className="cursor-pointer text-2xl leading-none text-brown-1 hover:text-brown-principal"
                  >
                     ×
                  </Dialog.Close>
               </div>
               {/* Descripción oculta: Radix la exige para accesibilidad */}
               <Dialog.Description className="sr-only">
                  Productos añadidos a tu carrito
               </Dialog.Description>

               {!isReady ? (
                  <div
                     role="status"
                     aria-label="Cargando carrito"
                     className="flex flex-1 items-center justify-center"
                  >
                     <span className="size-6 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
                  </div>
               ) : lines.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3.5 p-10 text-center">
                     <p
                        aria-hidden
                        className="text-4xl opacity-40"
                     >
                        🛍
                     </p>
                     <p className="text-[15px] text-brown-1">Tu carrito está vacío</p>
                     <Link
                        href={ROUTES.catalog}
                        onClick={closeDrawer}
                        className="bg-brown-principal px-[26px] py-[13px] text-[13px] text-neutro-2 hover:bg-brown-2"
                     >
                        Explorar tienda
                     </Link>
                  </div>
               ) : (
                  <>
                     <ul className="flex-1 overflow-y-auto px-7 py-2">
                        {lines.map((line) => (
                           <CartLineItem
                              key={`${line.productId}-${line.size}`}
                              line={line}
                              onQuantityChange={(quantity) =>
                                 setQuantity(line.productId, line.size, quantity)
                              }
                              onRemove={() => removeItem(line.productId, line.size)}
                              onNavigate={closeDrawer}
                           />
                        ))}
                     </ul>

                     {cart && (
                        <div className="border-t border-beige-2 bg-beige-1 px-7 py-[22px]">
                           <div className="mb-4">
                              <FreeShippingProgress
                                 amountToFreeShipping={cart.amountToFreeShipping}
                                 subtotal={cart.subtotal}
                              />
                           </div>
                           <div className="mb-2 flex justify-between text-sm">
                              <span className="text-brown-1">Subtotal</span>
                              <span className="font-helvetica-medium">
                                 {formatPrice(cart.subtotal)}
                              </span>
                           </div>
                           <div className="mb-4 flex justify-between text-sm">
                              <span className="text-brown-1">Envío</span>
                              <span className="font-helvetica-medium">
                                 {cart.shipping === 0
                                    ? 'Gratis'
                                    : formatPrice(cart.shipping)}
                              </span>
                           </div>
                           <Link
                              href={ROUTES.cart}
                              onClick={closeDrawer}
                              className="block w-full bg-coral-principal py-[15px] text-center text-sm font-helvetica-medium tracking-[0.04em] text-white transition-colors hover:bg-coral-4"
                           >
                              Ver carrito y pagar · {formatPrice(cart.total)}
                           </Link>
                        </div>
                     )}
                  </>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

'use client'
// Client Component: el carrito del invitado vive en el navegador
// (localStorage), así que el servidor no puede pintarlo

import { CartLineItem } from '@/components/shared/cart/CartLineItem'
import { FreeShippingProgress } from '@/components/shared/cart/FreeShippingProgress'
import { Container } from '@/components/shared/Container'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/format-price'
import { ROUTES } from '@/lib/routes'
import Link from 'next/link'

export function CartPageContent() {
   const { cart, isReady, error, setQuantity, removeItem } = useCart()
   const lines = cart?.lines ?? []
   const hasUnavailableLines = lines.some((line) => line.unavailableReason)

   return (
      <Container className="max-w-[1100px] pt-8 pb-[72px]">
         <nav
            aria-label="Ruta de navegación"
            className="mb-3.5 text-xs tracking-[0.04em] text-brown-1"
         >
            <Link
               href={ROUTES.home}
               className="hover:text-brown-principal"
            >
               Inicio
            </Link>
            <span aria-hidden> / </span>
            <span
               aria-current="page"
               className="text-brown-principal"
            >
               Carrito
            </span>
         </nav>
         <h1 className="mb-8 font-bricolage-bold text-[40px] tracking-[-0.02em] text-brown-principal">
            Tu carrito
         </h1>

         {!isReady ? (
            <div
               role="status"
               aria-label="Cargando carrito"
               className="flex justify-center py-24"
            >
               <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
            </div>
         ) : error && !cart ? (
            <p
               role="alert"
               className="rounded-md border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
            >
               No pudimos cargar tu carrito. Revisa tu conexión y recarga la
               página.
            </p>
         ) : lines.length === 0 ? (
            <div className="rounded-md bg-neutro-1 px-5 py-[90px] text-center">
               <p
                  aria-hidden
                  className="mb-4 text-[42px] opacity-40"
               >
                  🛍
               </p>
               <p className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
                  Tu carrito está vacío
               </p>
               <p className="mb-6 text-sm text-brown-1">
                  Explora la colección y añade tus prendas favoritas.
               </p>
               <Link
                  href={ROUTES.catalog}
                  className="inline-block bg-brown-principal px-[30px] py-3.5 text-[13px] text-neutro-2 hover:bg-brown-2"
               >
                  Explorar tienda
               </Link>
            </div>
         ) : (
            <div className="grid items-start gap-10 md:grid-cols-[1fr_340px]">
               <section aria-label="Productos del carrito">
                  {hasUnavailableLines && (
                     <p
                        role="status"
                        className="mb-2 rounded-md border border-beige-2 bg-beige-1 px-4 py-3 text-[13px] text-brown-2"
                     >
                        Algunos productos ya no están disponibles. Se muestran
                        para que puedas quitarlos, pero no se cobran.
                     </p>
                  )}
                  <ul>
                     {lines.map((line) => (
                        <CartLineItem
                           key={`${line.productId}-${line.size}`}
                           line={line}
                           variant="full"
                           onQuantityChange={(quantity) =>
                              setQuantity(line.productId, line.size, quantity)
                           }
                           onRemove={() => removeItem(line.productId, line.size)}
                        />
                     ))}
                  </ul>
                  <Link
                     href={ROUTES.catalog}
                     className="mt-6 inline-block text-[13px] text-coral-principal hover:underline"
                  >
                     ← Seguir comprando
                  </Link>
               </section>

               {cart && (
                  // sticky: el resumen acompaña al bajar por una lista larga
                  <aside
                     aria-label="Resumen del pedido"
                     className="sticky top-[90px] rounded-md border border-beige-2 bg-neutro-1 p-[26px]"
                  >
                     <h2 className="mb-5 font-bricolage-semibold text-xl text-brown-principal">
                        Resumen
                     </h2>
                     <dl className="flex flex-col gap-[11px] text-sm">
                        <div className="flex justify-between">
                           <dt className="text-brown-1">
                              Subtotal ({cart.itemCount}{' '}
                              {cart.itemCount === 1 ? 'artículo' : 'artículos'})
                           </dt>
                           <dd className="font-helvetica-medium">
                              {formatPrice(cart.subtotal)}
                           </dd>
                        </div>
                        {cart.savings > 0 && (
                           <div className="flex justify-between text-success">
                              {/* El precio ya viene rebajado: esto informa de
                                  cuánto se ahorra, NO se resta otra vez */}
                              <dt>Ahorras</dt>
                              <dd>{formatPrice(cart.savings)}</dd>
                           </div>
                        )}
                        <div className="flex justify-between">
                           <dt className="text-brown-1">Envío</dt>
                           <dd className="font-helvetica-medium">
                              {cart.shipping === 0
                                 ? 'Gratis'
                                 : formatPrice(cart.shipping)}
                           </dd>
                        </div>
                     </dl>

                     <div className="mt-3.5">
                        <FreeShippingProgress
                           amountToFreeShipping={cart.amountToFreeShipping}
                           subtotal={cart.subtotal}
                        />
                     </div>

                     <div className="mt-4 flex justify-between border-t border-beige-2 pt-4 text-lg font-helvetica-bold text-brown-principal">
                        <span>Total</span>
                        <span>{formatPrice(cart.total)}</span>
                     </div>

                     {/* TODO(checkout): el pago es la siguiente gran fase.
                         Deshabilitado para no prometer algo que aún no existe */}
                     <button
                        type="button"
                        disabled
                        aria-describedby="checkout-note"
                        className="mt-[22px] w-full cursor-not-allowed bg-coral-principal py-4 text-sm font-helvetica-medium tracking-[0.04em] text-white opacity-60"
                     >
                        Finalizar compra
                     </button>
                     <p
                        id="checkout-note"
                        className="mt-2 text-center text-xs text-brown-1"
                     >
                        El pago estará disponible muy pronto.
                     </p>
                     <p className="mt-3 flex justify-center gap-2 text-[11px] tracking-[0.06em] text-brown-1">
                        <span>VISA</span>
                        <span aria-hidden>·</span>
                        <span>MASTERCARD</span>
                        <span aria-hidden>·</span>
                        <span>PAYPAL</span>
                     </p>
                  </aside>
               )}
            </div>
         )}
      </Container>
   )
}

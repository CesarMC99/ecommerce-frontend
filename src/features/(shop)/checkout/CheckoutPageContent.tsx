'use client'

import { AuthGuard } from '@/components/shared/AuthGuard'
import { Container } from '@/components/shared/Container'
import type { CartFieldsFragment } from '@/graphql/generated/graphql'
import { useCart } from '@/hooks/use-cart'
import { ROUTES } from '@/lib/routes'
import { getStripe } from '@/lib/stripe'
import { useSession } from '@/providers/SessionProvider'
import { Elements } from '@stripe/react-stripe-js'
import Link from 'next/link'
import { CheckoutForm } from './CheckoutForm'
import { CheckoutSummary, type SummaryLine } from './CheckoutSummary'
import { STRIPE_APPEARANCE } from './stripe-appearance'

// El checkout exige sesión: AuthGuard manda a los invitados al login y
// los devuelve aquí después
export function CheckoutPageContent() {
   return (
      <Container className="max-w-[1100px] pt-8 pb-[72px]">
         <nav
            aria-label="Ruta de navegación"
            className="mb-3.5 text-xs tracking-[0.04em] text-brown-1"
         >
            <Link
               href={ROUTES.cart}
               className="hover:text-brown-principal"
            >
               Carrito
            </Link>
            <span aria-hidden> / </span>
            <span
               aria-current="page"
               className="text-brown-principal"
            >
               Finalizar compra
            </span>
         </nav>
         <h1 className="mb-8 font-bricolage-bold text-[40px] tracking-[-0.02em] text-brown-principal">
            Finalizar compra
         </h1>
         <AuthGuard>
            <Checkout />
         </AuthGuard>
      </Container>
   )
}

function Checkout() {
   const { user } = useSession()
   const { cart, isReady } = useCart()

   if (!isReady) {
      return (
         <div
            role="status"
            aria-label="Cargando carrito"
            className="flex justify-center py-24"
         >
            <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
         </div>
      )
   }

   if (!cart || cart.itemCount === 0) {
      return (
         <div className="rounded-md bg-neutro-1 px-5 py-[90px] text-center">
            <p className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
               No hay nada que pagar
            </p>
            <p className="mb-6 text-sm text-brown-1">
               Tu carrito está vacío. Añade alguna prenda para continuar.
            </p>
            <Link
               href={ROUTES.catalog}
               className="inline-block bg-brown-principal px-[30px] py-3.5 text-[13px] text-neutro-2 hover:bg-brown-2"
            >
               Explorar tienda
            </Link>
         </div>
      )
   }

   const hasUnavailableLines = cart.lines.some((line) => line.unavailableReason)

   return (
      <div className="grid items-start gap-10 md:grid-cols-[1fr_360px]">
         <div>
            {hasUnavailableLines && (
               <p
                  role="status"
                  className="mb-6 rounded-md border border-beige-2 bg-beige-1 px-4 py-3 text-[13px] text-brown-2"
               >
                  Hay productos que ya no están disponibles.{' '}
                  <Link
                     href={ROUTES.cart}
                     className="text-coral-principal hover:underline"
                  >
                     Revisa tu carrito
                  </Link>{' '}
                  antes de pagar.
               </p>
            )}
            {/* "Pago diferido": el formulario de la tarjeta se muestra YA,
                antes de crear el pedido. Stripe solo necesita saber el
                importe y la moneda para decidir qué mostrar; el cobro real
                lo crea el backend al pulsar "Pagar". Si el total cambia,
                Elements se actualiza solo */}
            <Elements
               stripe={getStripe()}
               options={{
                  mode: 'payment',
                  amount: cart.total,
                  currency: 'eur',
                  // Debe coincidir con payment_method_types del backend
                  paymentMethodTypes: ['card'],
                  appearance: STRIPE_APPEARANCE,
                  locale: 'es',
               }}
            >
               <CheckoutForm
                  accountEmail={user?.email ?? ''}
                  total={cart.total}
                  blocked={hasUnavailableLines}
               />
            </Elements>
         </div>

         <CheckoutSummary
            lines={toSummaryLines(cart)}
            subtotal={cart.subtotal}
            shipping={cart.shipping}
            total={cart.total}
            savings={cart.savings}
         />
      </div>
   )
}

/** Líneas del carrito → forma del resumen (solo las que se pueden comprar). */
function toSummaryLines(cart: CartFieldsFragment): SummaryLine[] {
   return cart.lines
      .filter((line) => line.unavailableReason === null && line.product)
      .map((line) => ({
         key: `${line.productId}-${line.size}`,
         name: line.product!.name,
         size: line.size,
         colorName: line.product!.color.name,
         quantity: line.quantity,
         lineTotal: line.lineTotal,
         image: line.product!.mainImage,
      }))
}

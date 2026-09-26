'use client'

import { AuthGuard } from '@/components/shared/AuthGuard'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Container } from '@/components/shared/Container'
import type { OrderFieldsFragment } from '@/graphql/generated/graphql'
import { MY_CART } from '@/graphql/modules/cart/queries/cart.queries'
import { CONFIRM_ORDER_PAYMENT } from '@/graphql/modules/orders/mutations/checkout.mutations'
import { formatPrice } from '@/lib/format-price'
import { getErrorMessage } from '@/lib/graphql-error'
import { productRoute, ROUTES } from '@/lib/routes'
import { useMutation } from '@apollo/client/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/** Reintentos mientras el pago sigue "en proceso" (y cada cuánto). */
const MAX_ATTEMPTS = 5
const RETRY_DELAY_MS = 2000

// 'MX' → 'México'. Lo traduce el propio navegador: no hace falta otra
// petición al backend solo para el nombre del país
const COUNTRY_NAMES = new Intl.DisplayNames(['es'], { type: 'region' })

interface OrderConfirmationContentProps {
   orderId: string | null
}

export function OrderConfirmationContent({
   orderId,
}: OrderConfirmationContentProps) {
   return (
      <Container className="max-w-[820px] pt-12 pb-[72px]">
         <AuthGuard>
            {orderId ? (
               <Confirmation orderId={orderId} />
            ) : (
               <Message
                  title="Pedido no encontrado"
                  text="El enlace no es válido."
               />
            )}
         </AuthGuard>
      </Container>
   )
}

function Confirmation({ orderId }: { orderId: string }) {
   const [order, setOrder] = useState<OrderFieldsFragment | null>(null)
   const [error, setError] = useState<string>()
   const [confirmPayment] = useMutation(CONFIRM_ORDER_PAYMENT, {
      // Al pagarse, el backend quitó lo comprado del carrito: se recarga
      // para que el contador del header baje a 0 sin recargar la página
      refetchQueries: [{ query: MY_CART }],
   })
   useEffect(() => {
      // Cada ejecución del efecto tiene su propio "cancelled". En desarrollo
      // React monta, desmonta y vuelve a montar: la primera ronda se
      // cancela y la segunda sigue. Confirmar dos veces es seguro porque el
      // backend es idempotente
      let cancelled = false
      let retryTimer: ReturnType<typeof setTimeout> | undefined

      const check = async (attempt: number) => {
         try {
            const { data } = await confirmPayment({ variables: { orderId } })
            if (cancelled || !data) return
            const current = data.confirmOrderPayment
            setOrder(current)
            // Aún pendiente: el banco no ha respondido. Se vuelve a
            // preguntar un poco más tarde (el webhook también lo resolverá)
            if (current.status === 'PENDING_PAYMENT' && attempt < MAX_ATTEMPTS) {
               retryTimer = setTimeout(() => void check(attempt + 1), RETRY_DELAY_MS)
            }
         } catch (err) {
            if (!cancelled) setError(getErrorMessage(err))
         }
      }

      void check(1)
      return () => {
         cancelled = true
         clearTimeout(retryTimer)
      }
   }, [orderId, confirmPayment])

   if (error) {
      return (
         <Message
            title="No pudimos cargar tu pedido"
            text={error}
         />
      )
   }

   if (!order) {
      return (
         <div
            role="status"
            aria-label="Confirmando el pago"
            className="flex flex-col items-center gap-4 py-24 text-sm text-brown-1"
         >
            <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
            Confirmando tu pago…
         </div>
      )
   }

   if (order.status === 'CANCELLED') {
      return (
         <Message
            title="Este pedido se canceló"
            text={`El pedido ${order.number} no se pagó a tiempo y las prendas volvieron a la tienda. No se te ha cobrado nada.`}
            action={{ href: ROUTES.cart, label: 'Volver al carrito' }}
         />
      )
   }

   if (order.status === 'PENDING_PAYMENT') {
      return (
         <Message
            title="Tu pago está pendiente"
            text={`Aún no hemos recibido la confirmación del pago del pedido ${order.number}. Si ya pagaste, se actualizará en unos minutos. Si el pago falló, puedes volver a intentarlo.`}
            action={{ href: ROUTES.checkout, label: 'Volver al pago' }}
         />
      )
   }

   return <PaidOrder order={order} />
}

function PaidOrder({ order }: { order: OrderFieldsFragment }) {
   const address = order.shippingAddress

   return (
      <div>
         <div className="mb-10 text-center">
            <p
               aria-hidden
               className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success"
            >
               ✓
            </p>
            <h1 className="mb-2 font-bricolage-bold text-[36px] tracking-[-0.02em] text-brown-principal">
               ¡Gracias por tu compra!
            </h1>
            <p className="text-sm text-brown-1">
               Tu pedido{' '}
               <span className="font-helvetica-medium text-brown-principal">
                  {order.number}
               </span>{' '}
               está confirmado. Te hemos enviado el recibo a {order.email}.
            </p>
         </div>

         <div className="grid gap-6 md:grid-cols-[1fr_260px]">
            <section
               aria-label="Productos del pedido"
               className="rounded-md border border-beige-2 bg-neutro-1 p-6"
            >
               <ul className="flex flex-col gap-4">
                  {order.lines.map((line) => (
                     <li
                        key={`${line.productId}-${line.size}`}
                        className="flex gap-4"
                     >
                        <div className="w-16 shrink-0">
                           <CloudinaryImage
                              image={
                                 line.imagePublicId
                                    ? { publicId: line.imagePublicId, alt: line.name }
                                    : null
                              }
                              className="aspect-[4/5]"
                              autoCrop="4:5"
                              sizes="64px"
                           />
                        </div>
                        <div className="min-w-0 flex-1">
                           <Link
                              href={productRoute(line.slug)}
                              className="block truncate text-sm font-helvetica-medium text-brown-principal hover:underline"
                           >
                              {line.name}
                           </Link>
                           <p className="text-xs text-brown-1">
                              Talla {line.size} · {line.colorName} ·{' '}
                              {line.quantity} × {formatPrice(line.unitPrice)}
                           </p>
                        </div>
                        <p className="text-sm font-helvetica-medium text-brown-principal">
                           {formatPrice(line.lineTotal)}
                        </p>
                     </li>
                  ))}
               </ul>
               <dl className="mt-5 flex flex-col gap-2 border-t border-beige-2 pt-4 text-sm">
                  <div className="flex justify-between">
                     <dt className="text-brown-1">Subtotal</dt>
                     <dd>{formatPrice(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                     <dt className="text-brown-1">Envío</dt>
                     <dd>
                        {order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}
                     </dd>
                  </div>
                  <div className="mt-2 flex justify-between text-base font-helvetica-bold text-brown-principal">
                     <dt>Total pagado</dt>
                     <dd>{formatPrice(order.total)}</dd>
                  </div>
               </dl>
            </section>

            <aside className="rounded-md border border-beige-2 bg-neutro-1 p-6 text-sm text-brown-2">
               <h2 className="mb-2 text-xs tracking-[0.06em] text-brown-1">
                  ENVÍO A
               </h2>
               <address className="not-italic leading-relaxed">
                  {address.fullName}
                  <br />
                  {address.line1}
                  <br />
                  {address.city}, {COUNTRY_NAMES.of(address.country)}
                  <br />
                  {address.phone}
                  <br />
                  {order.email}
               </address>
               <p className="mt-4 text-xs text-brown-1">
                  Lo recibirás en 2-4 días laborables.
               </p>
            </aside>
         </div>

         <div className="mt-10 text-center">
            <Link
               href={ROUTES.catalog}
               className="inline-block bg-brown-principal px-[30px] py-3.5 text-[13px] text-neutro-2 hover:bg-brown-2"
            >
               Seguir comprando
            </Link>
         </div>
      </div>
   )
}

interface MessageProps {
   title: string
   text: string
   action?: { href: string; label: string }
}

function Message({ title, text, action }: MessageProps) {
   return (
      <div className="rounded-md bg-neutro-1 px-5 py-[90px] text-center">
         <h1 className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
            {title}
         </h1>
         <p className="mx-auto mb-6 max-w-[460px] text-sm text-brown-1">{text}</p>
         <Link
            href={action?.href ?? ROUTES.catalog}
            className="inline-block bg-brown-principal px-[30px] py-3.5 text-[13px] text-neutro-2 hover:bg-brown-2"
         >
            {action?.label ?? 'Ir a la tienda'}
         </Link>
      </div>
   )
}

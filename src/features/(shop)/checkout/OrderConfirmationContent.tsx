'use client'

import { AuthGuard } from '@/components/shared/AuthGuard'
import { Container } from '@/components/shared/Container'
import type { OrderFieldsFragment } from '@/graphql/generated/graphql'
import { MY_CART } from '@/graphql/modules/cart/queries/cart.queries'
import { CONFIRM_ORDER_PAYMENT } from '@/graphql/modules/orders/mutations/checkout.mutations'
import { getErrorMessage } from '@/lib/graphql-error'
import { ROUTES } from '@/lib/routes'
import { useMutation } from '@apollo/client/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OrderDetails } from '../orders/OrderDetails'

/** Reintentos mientras el pago sigue "en proceso" (y cada cuánto). */
const MAX_ATTEMPTS = 5
const RETRY_DELAY_MS = 2000

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

         <OrderDetails order={order} />

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

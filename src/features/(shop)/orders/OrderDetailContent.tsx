'use client'

import { AuthGuard } from '@/components/shared/AuthGuard'
import { Container } from '@/components/shared/Container'
import { ORDER } from '@/graphql/modules/orders/queries/orders.queries'
import { getGraphQLErrorCode } from '@/lib/graphql-error'
import { ROUTES } from '@/lib/routes'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { OrderDetails, OrderStatusBadge } from './OrderDetails'
import { formatOrderDate } from './order-format'

export function OrderDetailContent({ orderId }: { orderId: string }) {
   return (
      <Container className="max-w-[900px] pt-8 pb-[72px]">
         <nav
            aria-label="Ruta de navegación"
            className="mb-3.5 text-xs tracking-[0.04em] text-brown-1"
         >
            <Link
               href={ROUTES.orders}
               className="hover:text-brown-principal"
            >
               Mis pedidos
            </Link>
            <span aria-hidden> / </span>
            <span
               aria-current="page"
               className="text-brown-principal"
            >
               Detalle
            </span>
         </nav>
         {/* Se llega también desde el correo de confirmación: si no hay
             sesión, AuthGuard lleva al login y después vuelve aquí */}
         <AuthGuard>
            <OrderDetail orderId={orderId} />
         </AuthGuard>
      </Container>
   )
}

function OrderDetail({ orderId }: { orderId: string }) {
   const { data, loading, error } = useQuery(ORDER, {
      variables: { id: orderId },
      fetchPolicy: 'cache-and-network',
   })
   const order = data?.order

   if (loading && !order) {
      return (
         <div
            role="status"
            aria-label="Cargando pedido"
            className="flex justify-center py-24"
         >
            <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
         </div>
      )
   }

   if (!order) {
      // NOT_FOUND también cuando el pedido es de OTRA persona: el backend no
      // revela si ese id existe
      const notFound = getGraphQLErrorCode(error) === 'NOT_FOUND'
      return (
         <div className="rounded-md bg-neutro-1 px-5 py-[90px] text-center">
            <h1 className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
               {notFound ? 'Pedido no encontrado' : 'No pudimos cargar el pedido'}
            </h1>
            <p className="mb-6 text-sm text-brown-1">
               {notFound
                  ? 'Este pedido no existe o no pertenece a tu cuenta.'
                  : 'Revisa tu conexión y recarga la página.'}
            </p>
            <Link
               href={ROUTES.orders}
               className="inline-block bg-brown-principal px-[30px] py-3.5 text-[13px] text-neutro-2 hover:bg-brown-2"
            >
               Ver mis pedidos
            </Link>
         </div>
      )
   }

   return (
      <>
         <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
               <h1 className="font-bricolage-bold text-[36px] tracking-[-0.02em] text-brown-principal">
                  Pedido {order.number}
               </h1>
               <p className="mt-1 text-sm text-brown-1">
                  Realizado el {formatOrderDate(order.paidAt ?? order.createdAt)}
               </p>
            </div>
            <OrderStatusBadge status={order.status} />
         </div>
         <OrderDetails order={order} />
         <div className="mt-8">
            <Link
               href={ROUTES.orders}
               className="text-[13px] text-coral-principal hover:underline"
            >
               ← Volver a mis pedidos
            </Link>
         </div>
      </>
   )
}

'use client'

import { AuthGuard } from '@/components/shared/AuthGuard'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Container } from '@/components/shared/Container'
import { Pagination } from '@/components/shared/Pagination'
import type { OrderFieldsFragment } from '@/graphql/generated/graphql'
import { MY_ORDERS } from '@/graphql/modules/orders/queries/orders.queries'
import { formatPrice } from '@/lib/format-price'
import { orderRoute, ordersRoute, ROUTES } from '@/lib/routes'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { OrderStatusBadge } from './OrderDetails'
import { formatOrderDate } from './order-format'

const PAGE_SIZE = 10
/** Miniaturas por pedido en la lista; el resto se resume como "+N" */
const MAX_THUMBNAILS = 4

export function OrdersPageContent({ page }: { page: number }) {
   return (
      <Container className="max-w-[900px] pt-8 pb-[72px]">
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
               Mis pedidos
            </span>
         </nav>
         <h1 className="mb-8 font-bricolage-bold text-[40px] tracking-[-0.02em] text-brown-principal">
            Mis pedidos
         </h1>
         {/* Pedidos = datos personales: solo con sesión */}
         <AuthGuard>
            <OrdersList page={page} />
         </AuthGuard>
      </Container>
   )
}

function OrdersList({ page }: { page: number }) {
   const { data, loading, error } = useQuery(MY_ORDERS, {
      variables: { page, pageSize: PAGE_SIZE },
      // Muestra lo que haya en caché al instante y lo refresca (un pedido
      // nuevo o un cambio de estado deben verse al volver a esta página)
      fetchPolicy: 'cache-and-network',
   })
   const result = data?.myOrders

   if (loading && !result) {
      return (
         <div
            role="status"
            aria-label="Cargando pedidos"
            className="flex justify-center py-24"
         >
            <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
         </div>
      )
   }

   if (error && !result) {
      return (
         <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
         >
            No pudimos cargar tus pedidos. Revisa tu conexión y recarga la página.
         </p>
      )
   }

   if (!result || result.totalCount === 0) {
      return (
         <div className="rounded-md bg-neutro-1 px-5 py-[90px] text-center">
            <p
               aria-hidden
               className="mb-4 text-[42px] opacity-40"
            >
               📦
            </p>
            <p className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
               Aún no tienes pedidos
            </p>
            <p className="mb-6 text-sm text-brown-1">
               Cuando compres algo, aquí podrás seguir su estado.
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

   return (
      <>
         <p className="mb-5 text-sm text-brown-1">
            {result.totalCount} {result.totalCount === 1 ? 'pedido' : 'pedidos'}
         </p>
         <ul className="flex flex-col gap-4">
            {result.items.map((order) => (
               <li key={order.id}>
                  <OrderCard order={order} />
               </li>
            ))}
         </ul>
         <Pagination
            page={result.page}
            totalPages={result.totalPages}
            pageHref={ordersRoute}
         />
      </>
   )
}

function OrderCard({ order }: { order: OrderFieldsFragment }) {
   const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0)
   const visibleLines = order.lines.slice(0, MAX_THUMBNAILS)
   const hiddenCount = order.lines.length - visibleLines.length

   return (
      // Toda la tarjeta es un enlace: más fácil de pulsar en el móvil
      <Link
         href={orderRoute(order.id)}
         className="block rounded-md border border-beige-2 bg-neutro-1 p-5 transition-colors hover:border-brown-1"
      >
         <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
               <p className="font-helvetica-medium text-brown-principal">
                  Pedido {order.number}
               </p>
               <p className="mt-0.5 text-xs text-brown-1">
                  {formatOrderDate(order.paidAt ?? order.createdAt)} · {itemCount}{' '}
                  {itemCount === 1 ? 'artículo' : 'artículos'}
               </p>
            </div>
            <OrderStatusBadge status={order.status} />
         </div>

         <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex gap-2">
               {visibleLines.map((line) => (
                  <div
                     key={`${line.productId}-${line.size}`}
                     className="w-12"
                  >
                     <CloudinaryImage
                        image={
                           line.imagePublicId
                              ? { publicId: line.imagePublicId, alt: line.name }
                              : null
                        }
                        className="aspect-[4/5] rounded-sm"
                        autoCrop="4:5"
                        sizes="48px"
                     />
                  </div>
               ))}
               {hiddenCount > 0 && (
                  <span className="flex aspect-[4/5] w-12 items-center justify-center rounded-sm bg-beige-1 text-xs text-brown-2">
                     +{hiddenCount}
                  </span>
               )}
            </div>
            <div className="text-right">
               <p className="text-lg font-helvetica-bold text-brown-principal">
                  {formatPrice(order.total)}
               </p>
               <p className="text-xs text-coral-principal">Ver detalle →</p>
            </div>
         </div>
      </Link>
   )
}

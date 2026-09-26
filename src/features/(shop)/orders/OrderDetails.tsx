import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import type { OrderFieldsFragment } from '@/graphql/generated/graphql'
import { formatPrice } from '@/lib/format-price'
import { productRoute } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { countryName, ORDER_STATUS_UI } from './order-format'

// Productos + totales + dirección de un pedido. Lo comparten la página de
// confirmación tras pagar y el detalle en "Mis pedidos": el cliente ve su
// pedido SIEMPRE igual, venga de donde venga
export function OrderDetails({ order }: { order: OrderFieldsFragment }) {
   const address = order.shippingAddress

   return (
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
                        {/* El slug es el del momento de la compra: si el producto
                            se retiró, el enlace llevará a "no encontrado" */}
                        <Link
                           href={productRoute(line.slug)}
                           className="block truncate text-sm font-helvetica-medium text-brown-principal hover:underline"
                        >
                           {line.name}
                        </Link>
                        <p className="text-xs text-brown-1">
                           Talla {line.size} · {line.colorName} · {line.quantity} ×{' '}
                           {formatPrice(line.unitPrice)}
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
                  <dd>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</dd>
               </div>
               <div className="mt-2 flex justify-between text-base font-helvetica-bold text-brown-principal">
                  <dt>{order.status === 'PAID' ? 'Total pagado' : 'Total'}</dt>
                  <dd>{formatPrice(order.total)}</dd>
               </div>
            </dl>
         </section>

         <aside className="rounded-md border border-beige-2 bg-neutro-1 p-6 text-sm text-brown-2">
            <h2 className="mb-2 text-xs tracking-[0.06em] text-brown-1">ENVÍO A</h2>
            <address className="not-italic leading-relaxed">
               {address.fullName}
               <br />
               {address.line1}
               <br />
               {address.city}, {countryName(address.country)}
               <br />
               {address.phone}
               <br />
               {order.email}
            </address>
            {order.status === 'PAID' && (
               <p className="mt-4 text-xs text-brown-1">
                  Lo recibirás en 2-4 días laborables.
               </p>
            )}
         </aside>
      </div>
   )
}

export function OrderStatusBadge({ status }: { status: OrderFieldsFragment['status'] }) {
   const { label, className } = ORDER_STATUS_UI[status]
   return (
      <span
         className={cn(
            'inline-block rounded-full px-2.5 py-1 text-[11px] font-helvetica-medium tracking-[0.04em]',
            className,
         )}
      >
         {label}
      </span>
   )
}

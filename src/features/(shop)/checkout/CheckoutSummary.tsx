import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { formatPrice } from '@/lib/format-price'

export interface SummaryLine {
   key: string
   name: string
   size: string
   colorName: string
   quantity: number
   lineTotal: number
   image: { publicId: string; alt: string } | null
}

interface CheckoutSummaryProps {
   lines: SummaryLine[]
   subtotal: number
   shipping: number
   total: number
   /** Opcional: solo el carrito calcula el ahorro por rebajas */
   savings?: number
}

// Resumen lateral del checkout. Recibe una forma NEUTRA (SummaryLine) y
// no el tipo del carrito o del pedido: así sirve para los dos pasos
// (antes de pagar muestra el carrito; al pagar, el pedido ya creado).
// Todos los importes vienen calculados por el backend
export function CheckoutSummary({
   lines,
   subtotal,
   shipping,
   total,
   savings = 0,
}: CheckoutSummaryProps) {
   const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)

   return (
      <aside
         aria-label="Resumen del pedido"
         className="rounded-md border border-beige-2 bg-neutro-1 p-[26px] md:sticky md:top-[90px]"
      >
         <h2 className="mb-4 font-bricolage-semibold text-xl text-brown-principal">
            Tu pedido
         </h2>

         <ul className="mb-5 flex max-h-[320px] flex-col gap-4 overflow-y-auto">
            {lines.map((line) => (
               <li
                  key={line.key}
                  className="flex gap-3"
               >
                  <div className="relative w-14 shrink-0">
                     <CloudinaryImage
                        image={line.image}
                        className="aspect-[4/5]"
                        autoCrop="4:5"
                        sizes="56px"
                     />
                     <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-brown-principal text-[11px] text-neutro-2">
                        {line.quantity}
                        <span className="sr-only"> unidades</span>
                     </span>
                  </div>
                  <div className="min-w-0 flex-1">
                     <p className="truncate text-sm font-helvetica-medium text-brown-principal">
                        {line.name}
                     </p>
                     <p className="text-xs text-brown-1">
                        Talla {line.size} · {line.colorName}
                     </p>
                  </div>
                  <p className="text-sm font-helvetica-medium text-brown-principal">
                     {formatPrice(line.lineTotal)}
                  </p>
               </li>
            ))}
         </ul>

         <dl className="flex flex-col gap-[11px] border-t border-beige-2 pt-4 text-sm">
            <div className="flex justify-between">
               <dt className="text-brown-1">
                  Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})
               </dt>
               <dd className="font-helvetica-medium">{formatPrice(subtotal)}</dd>
            </div>
            {savings > 0 && (
               <div className="flex justify-between text-success">
                  <dt>Ahorras</dt>
                  <dd>{formatPrice(savings)}</dd>
               </div>
            )}
            <div className="flex justify-between">
               <dt className="text-brown-1">Envío</dt>
               <dd className="font-helvetica-medium">
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
               </dd>
            </div>
         </dl>

         <div className="mt-4 flex justify-between border-t border-beige-2 pt-4 text-lg font-helvetica-bold text-brown-principal">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
         </div>
         <p className="mt-1 text-right text-[11px] text-brown-1">IVA incluido</p>
      </aside>
   )
}

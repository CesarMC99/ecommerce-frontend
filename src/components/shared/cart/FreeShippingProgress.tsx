import { formatPrice } from '@/lib/format-price'

interface FreeShippingProgressProps {
   /** Lo que falta para el envío gratis, en céntimos (0 = ya lo tiene) */
   amountToFreeShipping: number
   subtotal: number
}

// Barra "te faltan X € para el envío gratis". Es un clásico de las tiendas
// online: anima a añadir un producto más. Los números los calcula el
// backend; aquí solo se pintan
export function FreeShippingProgress({
   amountToFreeShipping,
   subtotal,
}: FreeShippingProgressProps) {
   if (amountToFreeShipping === 0) {
      return (
         <p className="text-xs text-success">✓ Tienes envío gratuito</p>
      )
   }

   const threshold = subtotal + amountToFreeShipping
   const percentage = Math.min(100, Math.round((subtotal / threshold) * 100))

   return (
      <div>
         <p className="text-xs text-brown-2">
            Te faltan{' '}
            <span className="font-helvetica-bold text-brown-principal">
               {formatPrice(amountToFreeShipping)}
            </span>{' '}
            para el envío gratis
         </p>
         {/* role="progressbar" + aria-value*: el lector de pantalla lee
             "64 %" en vez de ignorar una barra puramente visual */}
         <div
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso hacia el envío gratis"
            className="mt-2 h-1 overflow-hidden rounded-full bg-beige-2"
         >
            <div
               className="h-full rounded-full bg-coral-principal transition-[width] duration-500"
               style={{ width: `${percentage}%` }}
            />
         </div>
      </div>
   )
}

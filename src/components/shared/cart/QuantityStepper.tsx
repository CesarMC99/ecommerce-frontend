import { cn } from '@/lib/utils'

interface QuantityStepperProps {
   quantity: number
   /** Máximo permitido (stock y tope por línea, calculado por el backend) */
   max: number
   onChange: (quantity: number) => void
   disabled?: boolean
   size?: 'sm' | 'md'
   /** Nombre del producto, para que los botones digan "Quitar una unidad de…" */
   label: string
}

// Selector − 1 + en forma de píldora (como el diseño). Componente
// "tonto": no sabe nada del carrito, solo avisa del nuevo valor. Así sirve
// igual en el drawer, en la página del carrito o donde haga falta
export function QuantityStepper({
   quantity,
   max,
   onChange,
   disabled = false,
   size = 'md',
   label,
}: QuantityStepperProps) {
   const buttonClass = cn(
      'flex cursor-pointer items-center justify-center text-brown-1 transition-colors hover:text-brown-principal disabled:cursor-not-allowed disabled:opacity-40',
      size === 'sm' ? 'size-7' : 'size-[34px]',
   )

   return (
      <div className="flex items-center rounded-full border border-beige-2">
         <button
            type="button"
            aria-label={`Quitar una unidad de ${label}`}
            // Con 1 unidad, "−" no baja a 0: para quitar está el botón ×
            // (quitar un producto debe ser una acción deliberada)
            disabled={disabled || quantity <= 1}
            onClick={() => onChange(quantity - 1)}
            className={buttonClass}
         >
            −
         </button>
         <span
            aria-live="polite"
            className={cn(
               'min-w-[18px] text-center text-brown-principal',
               size === 'sm' ? 'text-[13px]' : 'text-sm',
            )}
         >
            {quantity}
         </span>
         <button
            type="button"
            aria-label={`Añadir una unidad de ${label}`}
            disabled={disabled || quantity >= max}
            onClick={() => onChange(quantity + 1)}
            className={buttonClass}
         >
            +
         </button>
      </div>
   )
}

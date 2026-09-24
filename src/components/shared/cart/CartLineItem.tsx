'use client'

import type { CartFieldsFragment } from '@/graphql/generated/graphql'
import { formatPrice } from '@/lib/format-price'
import { productRoute } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'
import { CloudinaryImage } from '../CloudinaryImage'
import { UNAVAILABLE_MESSAGES } from './cart-messages'
import { QuantityStepper } from './QuantityStepper'

type CartLine = CartFieldsFragment['lines'][number]

interface CartLineItemProps {
   line: CartLine
   onQuantityChange: (quantity: number) => Promise<void>
   onRemove: () => Promise<void>
   /** compact: drawer (foto pequeña). full: página /carrito */
   variant?: 'compact' | 'full'
   /** Al pulsar el producto (p. ej. cerrar el drawer antes de navegar) */
   onNavigate?: () => void
}

// Una línea del carrito. La comparten el drawer y la página /carrito:
// mismo comportamiento en los dos sitios, cambiando solo el tamaño
export function CartLineItem({
   line,
   onQuantityChange,
   onRemove,
   variant = 'compact',
   onNavigate,
}: CartLineItemProps) {
   // Mientras el backend responde, los controles se bloquean: evita que
   // un doble clic rápido mande dos cambios que se pisen
   const [isUpdating, setIsUpdating] = useState(false)
   const isCompact = variant === 'compact'
   const product = line.product
   const isAvailable = line.unavailableReason === null

   const run = async (action: () => Promise<void>) => {
      setIsUpdating(true)
      try {
         await action()
      } catch (error) {
         // Sin este catch, un fallo del backend quedaría como "promesa
         // rechazada sin capturar". El carrito en pantalla no cambia (la
         // caché solo se actualiza con respuestas correctas), así que el
         // usuario ve el estado real y puede reintentar
         console.error('[carrito] No se pudo actualizar la línea:', error)
      } finally {
         setIsUpdating(false)
      }
   }

   return (
      <li
         className={cn(
            'flex border-b border-beige-2 transition-opacity',
            isCompact ? 'gap-3.5 py-[18px]' : 'gap-5 py-[22px]',
            isUpdating && 'opacity-60',
         )}
      >
         <div className={cn('shrink-0', isCompact ? 'w-[72px]' : 'w-24')}>
            <CloudinaryImage
               image={product?.mainImage ?? null}
               className={cn('aspect-[4/5]', !isAvailable && 'grayscale')}
               autoCrop="4:5"
               sizes={isCompact ? '72px' : '96px'}
            />
         </div>

         <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
               <div className="min-w-0">
                  {product ? (
                     <Link
                        href={productRoute(product.slug)}
                        onClick={onNavigate}
                        className={cn(
                           'block truncate font-helvetica-medium text-brown-principal hover:underline',
                           isCompact ? 'text-sm' : 'text-base',
                        )}
                     >
                        {product.name}
                     </Link>
                  ) : (
                     <p className="text-sm text-brown-1">Producto no disponible</p>
                  )}
                  <p className="mt-0.5 text-xs text-brown-1">
                     Talla {line.size}
                     {product && ` · ${product.color.name}`}
                  </p>
               </div>
               <button
                  type="button"
                  onClick={() => run(onRemove)}
                  disabled={isUpdating}
                  aria-label={`Quitar ${product?.name ?? 'producto'} del carrito`}
                  className="cursor-pointer text-lg leading-none text-beige-3 transition-colors hover:text-coral-principal disabled:cursor-not-allowed"
               >
                  ×
               </button>
            </div>

            {isAvailable ? (
               <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityStepper
                     quantity={line.quantity}
                     max={line.maxQuantity}
                     disabled={isUpdating}
                     size={isCompact ? 'sm' : 'md'}
                     label={product?.name ?? 'producto'}
                     onChange={(quantity) => run(() => onQuantityChange(quantity))}
                  />
                  <span
                     className={cn(
                        'font-helvetica-medium text-brown-principal',
                        isCompact ? 'text-sm' : 'text-base',
                     )}
                  >
                     {formatPrice(line.lineTotal)}
                  </span>
               </div>
            ) : (
               // Línea no disponible: se explica POR QUÉ y no suma al total
               <p
                  role="status"
                  className="mt-3 text-xs text-destructive"
               >
                  {line.unavailableReason &&
                     UNAVAILABLE_MESSAGES[line.unavailableReason]}{' '}
                  No se incluye en el total.
               </p>
            )}
         </div>
      </li>
   )
}

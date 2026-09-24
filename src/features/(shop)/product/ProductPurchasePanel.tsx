'use client'
// Client Component: guarda la talla y la cantidad elegidas

import { SpriteIcon } from '@/components/shared/SpriteIcon'
import type { ProductDetailQuery } from '@/graphql/generated/graphql'
import { cn } from '@/lib/utils'
import { useId, useState } from 'react'
import { SizeGuideDialog, type SizeGuideKind } from './SizeGuideDialog'

type ProductSizes = NonNullable<ProductDetailQuery['product']>['sizes']

interface ProductPurchasePanelProps {
   sizes: ProductSizes
   inStock: boolean
}

// Límite de unidades por pedido. La API no expone el stock exacto (dato de
// negocio), así que se pone un tope razonable; el backend validará el stock
// real cuando exista el carrito
const MAX_QUANTITY = 10
// Talla de los productos que no tienen tallas (bolsos, bufandas)
const ONE_SIZE = 'ÚNICA'

// ¿Qué guía de tallas corresponde? Números → calzado; 'ÚNICA' → ninguna
function getSizeGuideKind(sizes: ProductSizes): SizeGuideKind | null {
   if (sizes.every((size) => size.size === ONE_SIZE)) return null
   if (sizes.every((size) => /^\d+$/.test(size.size))) return 'shoes'
   return 'clothing'
}

export function ProductPurchasePanel({
   sizes,
   inStock,
}: ProductPurchasePanelProps) {
   const isOneSize = sizes.length === 1 && sizes[0].size === ONE_SIZE
   // Talla única: ya viene elegida (no tiene sentido obligar a pulsarla)
   const [selectedSize, setSelectedSize] = useState<string | null>(
      isOneSize && sizes[0].inStock ? sizes[0].size : null,
   )
   const [quantity, setQuantity] = useState(1)
   const [message, setMessage] = useState<{
      tone: 'error' | 'info'
      text: string
   } | null>(null)

   const sizeGuideKind = getSizeGuideKind(sizes)
   const sizeLabelId = useId()

   const handleAdd = () => {
      // Validar ANTES de actuar: sin talla no hay nada que añadir
      if (!selectedSize) {
         setMessage({ tone: 'error', text: 'Elige una talla para continuar.' })
         return
      }
      // TODO(carrito): aquí se añadirá { producto, talla, cantidad } al
      // carrito cuando exista. De momento solo se confirma la selección
      setMessage({
         tone: 'info',
         text: `Talla ${selectedSize} × ${quantity} lista. El carrito llega en el siguiente paso.`,
      })
   }

   if (!inStock) {
      return (
         <p className="mt-8 rounded-md border border-beige-2 bg-beige-1 px-4 py-3 text-sm text-brown-2">
            Este producto está agotado en todas las tallas.
         </p>
      )
   }

   return (
      <div>
         {!isOneSize && (
            // role="group" + aria-labelledby: agrupa las tallas como UNA
            // pregunta ("Talla") para los lectores de pantalla. No se usa
            // <fieldset>/<legend> porque <legend> tiene que ser su primer
            // hijo directo, y aquí comparte fila con "Guía de tallas"
            <div
               role="group"
               aria-labelledby={sizeLabelId}
               className="mt-7"
            >
               <div className="mb-3 flex items-center justify-between">
                  <span
                     id={sizeLabelId}
                     className="text-xs tracking-[0.1em] text-brown-1"
                  >
                     TALLA{selectedSize && ` · ${selectedSize}`}
                  </span>
                  {sizeGuideKind && <SizeGuideDialog kind={sizeGuideKind} />}
               </div>
               <div className="flex flex-wrap gap-2.5">
                  {sizes.map((size) => {
                     const isSelected = selectedSize === size.size
                     return (
                        <button
                           key={size.size}
                           type="button"
                           // Talla agotada: visible (el cliente sabe que
                           // existe) pero deshabilitada y tachada
                           disabled={!size.inStock}
                           aria-pressed={isSelected}
                           aria-label={
                              size.inStock
                                 ? `Talla ${size.size}`
                                 : `Talla ${size.size}, agotada`
                           }
                           onClick={() => {
                              setSelectedSize(size.size)
                              setMessage(null)
                           }}
                           className={cn(
                              'min-w-[46px] cursor-pointer rounded border px-1.5 py-[11px] text-[13px] transition-colors',
                              isSelected
                                 ? 'border-brown-principal bg-brown-principal text-neutro-2'
                                 : 'border-beige-2 bg-neutro-1 text-brown-principal hover:border-brown-principal',
                              'disabled:cursor-not-allowed disabled:border-beige-2 disabled:bg-beige-1/40 disabled:text-beige-3 disabled:line-through',
                           )}
                        >
                           {size.size}
                        </button>
                     )
                  })}
               </div>
            </div>
         )}

         <div className="mt-7 flex items-stretch gap-3.5">
            {/* Selector de cantidad */}
            <div className="flex items-center rounded border border-beige-2">
               <button
                  type="button"
                  aria-label="Quitar una unidad"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => current - 1)}
                  className="flex h-12 w-[42px] cursor-pointer items-center justify-center text-lg text-brown-1 hover:text-brown-principal disabled:cursor-not-allowed disabled:opacity-40"
               >
                  −
               </button>
               {/* aria-live: al cambiar, el lector anuncia la nueva cantidad */}
               <span
                  aria-live="polite"
                  aria-label={`Cantidad: ${quantity}`}
                  className="min-w-7 text-center text-[15px] text-brown-principal"
               >
                  {quantity}
               </span>
               <button
                  type="button"
                  aria-label="Añadir una unidad"
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => setQuantity((current) => current + 1)}
                  className="flex h-12 w-[42px] cursor-pointer items-center justify-center text-lg text-brown-1 hover:text-brown-principal disabled:cursor-not-allowed disabled:opacity-40"
               >
                  +
               </button>
            </div>

            <button
               type="button"
               onClick={handleAdd}
               className="flex-1 cursor-pointer border border-brown-principal text-[13px] font-helvetica-medium tracking-[0.04em] text-brown-principal transition-colors hover:bg-brown-principal hover:text-neutro-2"
            >
               Añadir al carrito
            </button>
         </div>

         <button
            type="button"
            onClick={handleAdd}
            className="mt-3 w-full cursor-pointer bg-coral-principal py-[15px] text-sm font-helvetica-medium tracking-[0.04em] text-white transition-colors hover:bg-coral-4"
         >
            Comprar ahora
         </button>

         {message && (
            <p
               // Error → role="alert" (se anuncia de inmediato);
               // información → role="status" (se anuncia sin interrumpir)
               role={message.tone === 'error' ? 'alert' : 'status'}
               className={cn(
                  'mt-3 text-[13px]',
                  message.tone === 'error' ? 'text-destructive' : 'text-success',
               )}
            >
               {message.text}
            </p>
         )}

         {/* TODO(favoritos): conectar cuando exista el estado de favoritos */}
         <button
            type="button"
            className="mt-[18px] inline-flex cursor-pointer items-center gap-2 text-[13px] text-brown-1 hover:text-brown-principal"
         >
            <SpriteIcon
               name="heart"
               className="size-4 text-coral-principal"
            />
            Añadir a favoritos
         </button>
      </div>
   )
}

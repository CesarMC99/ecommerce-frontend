'use client'

import type { ProductCardFieldsFragment } from '@/graphql/generated/graphql'
import { useCart } from '@/hooks/use-cart'
import { productRoute } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

const ONE_SIZE = 'ÚNICA'

interface AddToCartQuickButtonProps {
   product: ProductCardFieldsFragment
}

// Estilo común: barra oscura que sube desde abajo al pasar el ratón por la
// foto (el `group` está en la tarjeta). focus-visible: también con teclado
const barClass =
   'absolute inset-x-0 bottom-0 translate-y-[101%] bg-brown-principal p-3 text-center text-[11px] tracking-[0.08em] text-neutro-2 transition-transform duration-300 group-hover:translate-y-0 focus-visible:translate-y-0'

// Botón rápido de la tarjeta de producto. Isla de cliente dentro de
// ProductCard (que sigue siendo de servidor)
export function AddToCartQuickButton({ product }: AddToCartQuickButtonProps) {
   const { addItem } = useCart()
   const [isAdding, setIsAdding] = useState(false)
   const oneSize =
      product.sizes.length === 1 && product.sizes[0].size === ONE_SIZE
         ? product.sizes[0]
         : null

   if (!product.inStock) {
      return (
         <span className={cn(barClass, 'cursor-not-allowed opacity-80')}>
            AGOTADO
         </span>
      )
   }

   // Con tallas no se puede adivinar cuál quiere: se lleva a la ficha
   if (!oneSize) {
      return (
         <Link
            href={productRoute(product.slug)}
            className={barClass}
         >
            ELEGIR TALLA
         </Link>
      )
   }

   const handleAdd = async () => {
      setIsAdding(true)
      try {
         await addItem({ productId: product.id, size: oneSize.size, quantity: 1 })
      } catch (error) {
         console.error('[carrito] No se pudo añadir:', error)
      } finally {
         setIsAdding(false)
      }
   }

   return (
      <button
         type="button"
         onClick={handleAdd}
         disabled={isAdding}
         className={cn(barClass, 'cursor-pointer disabled:opacity-80')}
      >
         {isAdding ? 'AÑADIENDO…' : 'AÑADIR AL CARRITO'}
      </button>
   )
}

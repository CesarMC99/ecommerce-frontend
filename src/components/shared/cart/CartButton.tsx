'use client'

import { useCart } from '@/hooks/use-cart'
import { useCartStore } from '@/stores/cart-store'
import { SpriteIcon } from '../SpriteIcon'

// Bolsa del header: abre el drawer y muestra cuántas unidades hay.
// Es una "isla" de cliente dentro del Header, que sigue siendo de servidor
export function CartButton() {
   const setDrawerOpen = useCartStore((state) => state.setDrawerOpen)
   const { itemCount } = useCart()

   return (
      <button
         type="button"
         onClick={() => setDrawerOpen(true)}
         // El número va en la etiqueta: el lector lee "Carrito, 3 productos"
         aria-label={
            itemCount > 0 ? `Carrito, ${itemCount} productos` : 'Carrito vacío'
         }
         className="relative cursor-pointer transition-opacity hover:opacity-70"
      >
         <SpriteIcon
            name="bag"
            className="size-[19px]"
         />
         {itemCount > 0 && (
            <span
               aria-hidden
               className="absolute -top-[7px] -right-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-coral-principal px-[3px] text-[9px] font-helvetica-bold text-white"
            >
               {/* Más de 99 no cabe en la bolita */}
               {itemCount > 99 ? '99+' : itemCount}
            </span>
         )}
      </button>
   )
}

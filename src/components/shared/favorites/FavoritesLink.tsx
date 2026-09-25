'use client'

import { useFavorites } from '@/hooks/use-favorites'
import { ROUTES } from '@/lib/routes'
import Link from 'next/link'
import { SpriteIcon } from '../SpriteIcon'

// Corazón del header con el número de favoritos (en el diseño, con la
// bolita oscura para diferenciarla de la del carrito, que es coral)
export function FavoritesLink() {
   const { count } = useFavorites()

   return (
      <Link
         href={ROUTES.favorites}
         aria-label={
            count > 0
               ? `Favoritos, ${count} ${count === 1 ? 'producto' : 'productos'}`
               : 'Favoritos'
         }
         className="relative text-coral-principal transition-opacity hover:opacity-70"
      >
         <SpriteIcon
            name="heart"
            className="size-[19px]"
         />
         {count > 0 && (
            <span
               aria-hidden
               className="absolute -top-[7px] -right-[9px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-brown-principal px-[3px] text-[9px] font-helvetica-bold text-white"
            >
               {count > 99 ? '99+' : count}
            </span>
         )}
      </Link>
   )
}

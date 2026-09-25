'use client'

import { useFavorites } from '@/hooks/use-favorites'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { SpriteIcon } from '../SpriteIcon'

interface FavoriteButtonProps {
   productId: string
   productName: string
   /**
    * icon: círculo blanco sobre la foto (tarjetas).
    * text: corazón + "Añadir a favoritos" (ficha de producto)
    */
   variant?: 'icon' | 'text'
   className?: string
}

// El corazón. Un solo componente para tarjetas y ficha: el comportamiento
// (marcar, desmarcar, estado) es idéntico; solo cambia el aspecto
export function FavoriteButton({
   productId,
   productName,
   variant = 'icon',
   className,
}: FavoriteButtonProps) {
   const { isFavorite, toggle } = useFavorites()
   const [isSaving, setIsSaving] = useState(false)
   const active = isFavorite(productId)

   const handleClick = async () => {
      setIsSaving(true)
      try {
         await toggle(productId)
      } catch (error) {
         console.error('[favoritos] No se pudo actualizar:', error)
      } finally {
         setIsSaving(false)
      }
   }

   const label = active
      ? `Quitar ${productName} de favoritos`
      : `Añadir ${productName} a favoritos`

   const icon = (
      <SpriteIcon
         // Relleno = guardado; contorno = no guardado
         name={active ? 'heart' : 'heart-outline'}
         className={cn(
            'size-4 text-coral-principal transition-transform',
            // Pequeño "latido" al marcar: confirma la acción visualmente
            active && 'scale-110',
         )}
      />
   )

   if (variant === 'text') {
      return (
         <button
            type="button"
            onClick={handleClick}
            disabled={isSaving}
            // aria-pressed: el lector anuncia "pulsado" / "no pulsado"
            aria-pressed={active}
            className={cn(
               'inline-flex cursor-pointer items-center gap-2 text-[13px] text-brown-1 transition-colors hover:text-brown-principal disabled:cursor-wait',
               className,
            )}
         >
            {icon}
            {active ? 'Guardado en favoritos' : 'Añadir a favoritos'}
         </button>
      )
   }

   return (
      <button
         type="button"
         onClick={handleClick}
         disabled={isSaving}
         aria-label={label}
         aria-pressed={active}
         className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-full bg-neutro-1 shadow-[0_2px_8px_rgba(26,18,13,0.08)] transition-transform hover:scale-110 disabled:cursor-wait',
            className,
         )}
      >
         {icon}
      </button>
   )
}

import { cn } from '@/lib/utils'

// Los nombres válidos son los <symbol id="..."> de public/images/icons/sprite.svg.
// Tiparlos hace que un icono mal escrito falle al compilar, no en silencio en pantalla
export type SpriteIconName =
   | 'bag'
   | 'search-normal'
   | 'profile'
   | 'heart'
   | 'star'
   | 'google'

interface SpriteIconProps {
   name: SpriteIconName
   className?: string
   // Texto para lectores de pantalla. Sin él, el icono es decorativo y se oculta
   label?: string
}

export function SpriteIcon({ name, className, label }: SpriteIconProps) {
   return (
      <svg
         className={cn('size-5', className)}
         aria-hidden={label ? undefined : true}
         aria-label={label}
         role={label ? 'img' : undefined}
      >
         <use href={`/images/icons/sprite.svg#${name}`} />
      </svg>
   )
}

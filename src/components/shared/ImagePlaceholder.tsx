import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
   // Texto pequeño que indica qué foto irá ahí ("FOTO EDITORIAL · 4:5")
   label?: string
   className?: string
   children?: React.ReactNode
}

// Ocupa el lugar de una foto mientras no haya imágenes reales.
// Cuando lleguen, se sustituye por <Image> de next/image en UN solo sitio
export function ImagePlaceholder({
   label,
   className,
   children,
}: ImagePlaceholderProps) {
   return (
      <div
         className={cn(
            'relative flex items-end overflow-hidden rounded bg-placeholder-stripes font-mono text-[10px] tracking-[0.08em] text-brown-1',
            className,
         )}
      >
         {label && <span className="p-5">{label}</span>}
         {children}
      </div>
   )
}

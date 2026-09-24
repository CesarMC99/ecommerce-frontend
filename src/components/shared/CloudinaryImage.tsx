import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ImagePlaceholder } from './ImagePlaceholder'

// Forma mínima de una imagen alojada en Cloudinary. Coincide con
// ProductImage del schema, pero no se ata a él: también la usan las
// imágenes de la tienda (hero, categorías, banner)
export interface CloudinaryImageData {
   publicId: string
   alt: string
}

interface CloudinaryImageProps {
   image: CloudinaryImageData | null
   // Qué ancho ocupa la foto en pantalla. Sin esto, el navegador asumiría
   // que ocupa TODA la pantalla y descargaría una foto enorme para una tarjeta
   sizes: string
   // Proporción del hueco ('3:4', '4:5'...). Si se indica, Cloudinary
   // recorta la foto a esa proporción centrándose en lo IMPORTANTE (caras,
   // la prenda...) en lugar de cortar ciegamente por el centro como CSS
   autoCrop?: string
   className?: string
   // true solo para fotos visibles al cargar (arriba del todo): se descargan
   // antes. Para el resto, la carga diferida (lazy) es mejor
   priority?: boolean
}

// Imagen de Cloudinary con fallback: si no hay imagen, se muestra el
// placeholder de franjas. Así un producto sin fotos nunca rompe la tienda
// ni deja un hueco en blanco
export function CloudinaryImage({
   image,
   sizes,
   autoCrop,
   className,
   priority = false,
}: CloudinaryImageProps) {
   if (!image) return <ImagePlaceholder className={className} />

   // Transformación ENCADENADA: el loader añade delante el tamaño/formato y
   // después Cloudinary aplica este recorte. g_auto = "gravedad automática":
   // la IA de Cloudinary decide qué parte de la foto conservar
   const src = autoCrop
      ? `c_fill,g_auto,ar_${autoCrop}/${image.publicId}`
      : image.publicId

   return (
      // relative + fill: la imagen ocupa el contenedor, cuyo tamaño lo fija
      // `className` (p. ej. aspect-3/4). Así todas las tarjetas miden igual
      // aunque cada foto tenga una proporción distinta
      <div className={cn('relative overflow-hidden rounded bg-beige-1', className)}>
         <Image
            src={src}
            alt={image.alt}
            fill
            sizes={sizes}
            // En Next 16 la prop `priority` está obsoleta. Lo recomendado
            // para la imagen principal es cargarla YA (eager) y pedirle al
            // navegador que la trate como urgente (fetchPriority high)
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            // object-cover: si aún sobra algo (sin autoCrop), recorta en vez
            // de deformar la foto
            className="object-cover"
         />
      </div>
   )
}

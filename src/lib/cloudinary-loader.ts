'use client'

import type { ImageLoaderProps } from 'next/image'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

// Loader de next/image: traduce <Image src="ambar/products/abrigo-de-lana-1">
// en una URL de Cloudinary con el ANCHO exacto que pide cada pantalla.
//
// next/image genera varios anchos (srcset) y el navegador elige el menor que
// le sirve: un móvil descarga 640 px y un monitor retina 1920 px, de la MISMA
// foto guardada una sola vez. Cloudinary redimensiona al vuelo y lo cachea
export default function cloudinaryLoader({ src, width }: ImageLoaderProps) {
   // Imágenes locales de /public (logos, iconos): se sirven tal cual
   if (src.startsWith('/') || src.startsWith('http')) return src

   const transformations = [
      'f_auto', // formato automático: AVIF/WebP si el navegador lo soporta
      'q_auto', // calidad automática: Cloudinary busca el mínimo sin pérdida visible
      'c_limit', // solo reduce, nunca agranda una foto pequeña
      `w_${width}`,
   ].join(',')

   return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${src}`
}

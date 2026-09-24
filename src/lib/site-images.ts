import type { CloudinaryImageData } from '@/components/shared/CloudinaryImage'
import type { CatalogCategory } from './routes'

// Imágenes de la TIENDA (no de productos). Viven en Cloudinary con un
// publicId fijo que sube el backend con `pnpm seed:images` desde
// seed-images/site/. Para cambiar una foto basta con reemplazar el archivo y
// volver a ejecutar el script: el publicId no cambia, así que aquí no se toca nada.
//
// El `alt` describe la foto para lectores de pantalla y buscadores: se
// describe lo que SE VE, no "imagen de..." (el lector ya anuncia que es una imagen)

export const HERO_IMAGE: CloudinaryImageData = {
   publicId: 'ambar/site/hero',
   alt: 'Mujer con gafas de sol, sudadera y pantalón cargo beige sentada al aire libre bajo un cielo azul',
}

export const CATEGORY_IMAGES: Record<CatalogCategory, CloudinaryImageData> = {
   mujer: {
      publicId: 'ambar/site/categoria-mujer',
      alt: 'Mujer con chaqueta de borreguito blanca frente a una persiana',
   },
   hombre: {
      publicId: 'ambar/site/categoria-hombre',
      alt: 'Hombre con gorro y jersey negros y gafas de sol al atardecer',
   },
   accesorios: {
      publicId: 'ambar/site/categoria-accesorios',
      alt: 'Zapatos de ante, cinturón de piel, reloj y anillos sobre tela beige',
   },
}

export const PROMO_IMAGE: CloudinaryImageData = {
   publicId: 'ambar/site/promo-rebajas',
   alt: 'Joven con chaqueta de cuero, gorro de lana y gafas de sol frente a un muro de cristal',
}

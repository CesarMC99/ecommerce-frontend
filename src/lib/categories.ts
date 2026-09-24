import type { ProductCategory } from '@/graphql/generated/graphql'
import type { CatalogCategory } from './routes'

// Una categoría tiene TRES formas según dónde aparezca:
//  - en la URL, en español para personas:   'mujer'
//  - en la API, como enum del backend:      'WOMEN'
//  - en pantalla, con mayúscula y acentos:  'Mujer'
// Las traducciones viven aquí para que catálogo, detalle de producto y
// migas de pan usen EXACTAMENTE las mismas (antes estaban repetidas)

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
   mujer: 'Mujer',
   hombre: 'Hombre',
   accesorios: 'Accesorios',
}

export const CATEGORY_TO_API: Record<CatalogCategory, ProductCategory> = {
   mujer: 'WOMEN',
   hombre: 'MEN',
   accesorios: 'ACCESSORIES',
}

export const API_TO_CATEGORY: Record<ProductCategory, CatalogCategory> = {
   WOMEN: 'mujer',
   MEN: 'hombre',
   ACCESSORIES: 'accesorios',
}

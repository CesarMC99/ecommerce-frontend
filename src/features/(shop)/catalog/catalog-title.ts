import { CATEGORY_LABELS } from '@/lib/categories'
import type { CatalogFilters } from '@/lib/routes'

// Título según lo que se está viendo: si llegas desde "Mujer" en el menú,
// la página debe decir "Mujer", no un genérico "Catálogo".
// Prioridad: categoría > rebajas > novedades > catálogo
export function getCatalogTitle(filters: CatalogFilters): string {
   if (filters.categoria) return CATEGORY_LABELS[filters.categoria]
   if (filters.rebajas) return 'Rebajas'
   if (filters.orden === 'novedades') return 'Novedades'
   return 'Catálogo'
}

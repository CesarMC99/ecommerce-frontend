import type { CatalogCategory, CatalogFilters } from '@/lib/routes'

const CATEGORY_TITLES: Record<CatalogCategory, string> = {
   mujer: 'Mujer',
   hombre: 'Hombre',
   accesorios: 'Accesorios',
}

// Título según lo que se está viendo: si llegas desde "Mujer" en el menú,
// la página debe decir "Mujer", no un genérico "Catálogo".
// Prioridad: categoría > rebajas > novedades > catálogo
export function getCatalogTitle(filters: CatalogFilters): string {
   if (filters.categoria) return CATEGORY_TITLES[filters.categoria]
   if (filters.rebajas) return 'Rebajas'
   if (filters.orden === 'novedades') return 'Novedades'
   return 'Catálogo'
}

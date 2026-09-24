import type {
   CatalogQueryVariables,
   ProductCategory,
   ProductSort,
} from '@/graphql/generated/graphql'
import {
   CATALOG_CATEGORIES,
   CATALOG_SORTS,
   type CatalogCategory,
   type CatalogFilters,
   type CatalogSort,
} from '@/lib/routes'
import { z } from 'zod'

// Productos por página: 3 columnas × 3 filas, como la cuadrícula del diseño
export const CATALOG_PAGE_SIZE = 9

// Next entrega los searchParams como string, string[] (si el parámetro se
// repite: ?color=a&color=b) o undefined
type RawSearchParams = Record<string, string | string[] | undefined>

// Cada parámetro tiene su propio esquema. `.catch(undefined)`: si el valor
// es inválido (?precio=abc, ?pagina=-5, ?categoria=niños) NO se lanza un
// error, simplemente se ignora ese filtro. La URL la escribe cualquiera:
// una URL mal formada debe mostrar el catálogo, no una página de error
const searchParamsSchema = z.object({
   categoria: z.enum(CATALOG_CATEGORIES).optional().catch(undefined),
   color: z.string().trim().min(1).max(50).optional().catch(undefined),
   talla: z.string().trim().min(1).max(10).optional().catch(undefined),
   // z.coerce convierte el texto "100" en el número 100
   precio: z.coerce.number().int().positive().optional().catch(undefined),
   valoracion: z.coerce.number().min(0).max(5).optional().catch(undefined),
   rebajas: z
      .literal('true')
      .transform(() => true)
      .optional()
      .catch(undefined),
   orden: z.enum(CATALOG_SORTS).optional().catch(undefined),
   pagina: z.coerce.number().int().positive().optional().catch(undefined),
})

/** URL (texto sin validar) → filtros tipados y seguros. */
export function parseCatalogFilters(raw: RawSearchParams): CatalogFilters {
   // Si un parámetro viene repetido, se usa el primero
   const firstValues = Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [
         key,
         Array.isArray(value) ? value[0] : value,
      ]),
   )
   return searchParamsSchema.parse(firstValues)
}

// Traducciones URL (español, para personas) → API (enums del backend)
const CATEGORY_TO_API: Record<CatalogCategory, ProductCategory> = {
   mujer: 'WOMEN',
   hombre: 'MEN',
   accesorios: 'ACCESSORIES',
}

const SORT_TO_API: Record<CatalogSort, ProductSort> = {
   destacados: 'FEATURED',
   novedades: 'NEWEST',
   'precio-asc': 'PRICE_ASC',
   'precio-desc': 'PRICE_DESC',
   valorados: 'RATING',
}

/** Filtros de la URL → variables de la query GraphQL (tipos de Codegen). */
export function toCatalogVariables(
   filters: CatalogFilters,
): CatalogQueryVariables {
   return {
      filter: {
         category: filters.categoria
            ? CATEGORY_TO_API[filters.categoria]
            : undefined,
         color: filters.color,
         size: filters.talla,
         // La URL va en euros; la API en céntimos
         maxPrice: filters.precio !== undefined ? filters.precio * 100 : undefined,
         minRating: filters.valoracion,
         onSale: filters.rebajas,
      },
      sort: SORT_TO_API[filters.orden ?? 'destacados'],
      page: filters.pagina ?? 1,
      pageSize: CATALOG_PAGE_SIZE,
   }
}

// Qué parámetros cuentan como FILTRO (el orden y la página no reducen los
// resultados, así que no cuentan)
const FILTER_KEYS = [
   'categoria',
   'color',
   'talla',
   'precio',
   'valoracion',
   'rebajas',
] as const satisfies readonly (keyof CatalogFilters)[]

/** ¿Hay algún filtro activo? Decide si se muestra "Limpiar filtros". */
export function hasActiveFilters(filters: CatalogFilters): boolean {
   return FILTER_KEYS.some((key) => filters[key] !== undefined)
}

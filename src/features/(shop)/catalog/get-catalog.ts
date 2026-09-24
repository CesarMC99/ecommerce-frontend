import 'server-only'

import { query } from '@/graphql/apollo/register-apollo-client'
import { CATALOG } from '@/graphql/modules/products/queries/catalog.query'
import type { CatalogFilters } from '@/lib/routes'
import { toCatalogVariables } from './catalog-params'

// Carga productos + facetas EN EL SERVIDOR. A diferencia de la home, aquí
// NO se captura el error: el catálogo sin productos no tiene sentido, así
// que si el backend falla se muestra la página de error (error.tsx) con la
// opción de reintentar, en vez de un "0 resultados" que sería mentira
export async function getCatalog(filters: CatalogFilters) {
   const { data } = await query({
      query: CATALOG,
      variables: toCatalogVariables(filters),
   })
   if (!data) throw new Error('El catálogo no devolvió datos')
   return data
}

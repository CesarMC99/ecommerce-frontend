import 'server-only'

import { query } from '@/graphql/apollo/register-apollo-client'
import type { ProductCardFieldsFragment } from '@/graphql/generated/graphql'
import { HOME_PRODUCTS } from '@/graphql/modules/products/queries/home-products.query'

interface HomeProducts {
   featured: ProductCardFieldsFragment[]
   newArrivals: ProductCardFieldsFragment[]
}

// Carga los productos de la home EN EL SERVIDOR: el HTML llega ya con los
// productos pintados (sin spinner ni salto de contenido, y mejor para SEO).
//
// `import 'server-only'` hace que el build FALLE si alguien importa esto
// desde un Client Component: garantiza que nunca acabe en el navegador
export async function getHomeProducts(): Promise<HomeProducts> {
   try {
      const { data } = await query({ query: HOME_PRODUCTS })
      return {
         featured: data?.featured.items ?? [],
         newArrivals: data?.newArrivals.items ?? [],
      }
   } catch (error) {
      // Si el backend falla, la home NO se cae entera: el hero, las
      // categorías y el resto siguen funcionando y las secciones de
      // productos simplemente no se muestran. El error queda en el log
      // del servidor para poder investigarlo
      console.error('[home] No se pudieron cargar los productos:', error)
      return { featured: [], newArrivals: [] }
   }
}

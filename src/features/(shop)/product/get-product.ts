import 'server-only'

import { query } from '@/graphql/apollo/register-apollo-client'
import { PRODUCT_DETAIL } from '@/graphql/modules/products/queries/product-detail.query'
import { cache } from 'react'

// `cache` de React: la página y generateMetadata (el <title>) necesitan el
// MISMO producto. Sin cache serían dos peticiones al backend por cada
// visita; con cache, la segunda llamada con el mismo slug reutiliza el
// resultado de la primera (solo dentro de la misma petición al servidor)
export const getProduct = cache(async (slug: string) => {
   const { data } = await query({
      query: PRODUCT_DETAIL,
      variables: { slug },
   })
   if (!data) throw new Error('La ficha de producto no devolvió datos')
   return data
})

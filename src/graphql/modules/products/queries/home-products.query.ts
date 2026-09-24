import type {
   HomeProductsQuery,
   HomeProductsQueryVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { PRODUCT_CARD_FIELDS } from '../fragments/product-card.fragment'

// Las DOS secciones de la home en UNA sola petición. `featured:` y
// `newArrivals:` son ALIAS: permiten pedir el mismo campo (products) dos
// veces con argumentos distintos y recibir cada resultado con su nombre
export const HOME_PRODUCTS: TypedDocumentNode<
   HomeProductsQuery,
   HomeProductsQueryVariables
> = gql`
   query HomeProducts {
      featured: products(filter: { featured: true }, pageSize: 4) {
         items {
            ...ProductCardFields
         }
      }
      newArrivals: products(sort: NEWEST, pageSize: 4) {
         items {
            ...ProductCardFields
         }
      }
   }
   ${PRODUCT_CARD_FIELDS}
`

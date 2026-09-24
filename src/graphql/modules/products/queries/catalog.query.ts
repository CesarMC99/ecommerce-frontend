import type {
   CatalogQuery,
   CatalogQueryVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { PRODUCT_CARD_FIELDS } from '../fragments/product-card.fragment'

// La página de catálogo necesita DOS cosas: los productos filtrados y las
// opciones para pintar los filtros (colores, tallas, rango de precios).
// Van en UNA sola petición: un viaje de red en lugar de dos
export const CATALOG: TypedDocumentNode<CatalogQuery, CatalogQueryVariables> =
   gql`
      query Catalog(
         $filter: ProductFilterInput
         $sort: ProductSort!
         $page: Int!
         $pageSize: Int!
      ) {
         products(
            filter: $filter
            sort: $sort
            page: $page
            pageSize: $pageSize
         ) {
            totalCount
            page
            totalPages
            items {
               ...ProductCardFields
            }
         }
         productFacets {
            colors {
               name
               hex
            }
            sizes
            minPrice
            maxPrice
         }
      }
      ${PRODUCT_CARD_FIELDS}
   `

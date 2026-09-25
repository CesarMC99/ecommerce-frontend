import type {
   MyFavoriteIdsQuery,
   ProductsByIdsQuery,
   ProductsByIdsQueryVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { PRODUCT_CARD_FIELDS } from '../../products/fragments/product-card.fragment'

// Ids de mis favoritos (con sesión). Solo ids: con eso se pintan todos los
// corazones de la tienda sin descargar los productos
export const MY_FAVORITE_IDS: TypedDocumentNode<MyFavoriteIdsQuery> = gql`
   query MyFavoriteIds {
      myFavoriteIds
   }
`

// Página /favoritos: de ids a tarjetas. La usan invitados Y usuarios con
// sesión (un solo camino para pintar la lista)
export const PRODUCTS_BY_IDS: TypedDocumentNode<
   ProductsByIdsQuery,
   ProductsByIdsQueryVariables
> = gql`
   query ProductsByIds($ids: [ID!]!) {
      productsByIds(ids: $ids) {
         ...ProductCardFields
      }
   }
   ${PRODUCT_CARD_FIELDS}
`

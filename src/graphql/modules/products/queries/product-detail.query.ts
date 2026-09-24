import type {
   ProductDetailQuery,
   ProductDetailQueryVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { PRODUCT_CARD_FIELDS } from '../fragments/product-card.fragment'

// Página de producto: la ficha completa + "También te puede gustar", en UNA
// sola petición. La ficha pide TODAS las fotos (galería); los relacionados
// reutilizan el fragment de la tarjeta (solo la foto principal)
export const PRODUCT_DETAIL: TypedDocumentNode<
   ProductDetailQuery,
   ProductDetailQueryVariables
> = gql`
   query ProductDetail($slug: String!) {
      product(slug: $slug) {
         id
         slug
         name
         description
         details
         price
         compareAtPrice
         discountPercentage
         isNew
         category
         type
         color {
            name
            hex
         }
         sizes {
            size
            inStock
         }
         inStock
         images {
            publicId
            alt
            width
            height
         }
         rating
         reviewsCount
      }
      relatedProducts(slug: $slug, limit: 4) {
         ...ProductCardFields
      }
   }
   ${PRODUCT_CARD_FIELDS}
`

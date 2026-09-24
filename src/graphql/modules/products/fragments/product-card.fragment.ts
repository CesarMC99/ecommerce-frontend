import { gql } from '@apollo/client'

// Un FRAGMENT es un trozo reutilizable de query: "los campos que necesita
// una tarjeta de producto". La home, el catálogo y favoritos lo incluyen,
// y si mañana la tarjeta muestra el rating, se añade aquí UNA vez.
// Codegen genera el tipo ProductCardFieldsFragment, que usa <ProductCard>
export const PRODUCT_CARD_FIELDS = gql`
   fragment ProductCardFields on Product {
      id
      slug
      name
      price
      compareAtPrice
      discountPercentage
      isNew
      mainImage {
         publicId
         alt
      }
   }
`

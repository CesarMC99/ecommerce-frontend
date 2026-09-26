import { gql } from '@apollo/client'

// Todo lo que muestran el checkout y la página de confirmación. Las tres
// operaciones de pedidos devuelven este fragment: misma forma siempre
export const ORDER_FIELDS = gql`
   fragment OrderFields on Order {
      id
      number
      email
      status
      subtotal
      shipping
      total
      createdAt
      expiresAt
      paidAt
      lines {
         productId
         slug
         name
         colorName
         size
         imagePublicId
         unitPrice
         quantity
         lineTotal
      }
      shippingAddress {
         fullName
         phone
         line1
         city
         country
      }
   }
`

import { gql } from '@apollo/client'

// Todo lo que necesitan el drawer, el contador del header y la página
// /carrito. TODAS las operaciones del carrito (presupuesto de invitado,
// myCart y las mutations) devuelven este mismo fragment: así la UI recibe
// siempre la misma forma, venga el carrito de donde venga
export const CART_FIELDS = gql`
   fragment CartFields on Cart {
      itemCount
      subtotal
      savings
      shipping
      total
      amountToFreeShipping
      lines {
         productId
         size
         quantity
         unitPrice
         lineTotal
         maxQuantity
         unavailableReason
         product {
            id
            slug
            name
            color {
               name
            }
            mainImage {
               publicId
               alt
            }
         }
      }
   }
`

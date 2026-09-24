import type {
   CartQuoteQuery,
   CartQuoteQueryVariables,
   MyCartQuery,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { CART_FIELDS } from '../fragments/cart.fragment'

// Carrito del INVITADO: el navegador envía qué quiere comprar (sin precios)
// y el backend devuelve el carrito calculado
export const CART_QUOTE: TypedDocumentNode<
   CartQuoteQuery,
   CartQuoteQueryVariables
> = gql`
   query CartQuote($items: [CartItemInput!]!) {
      cartQuote(items: $items) {
         ...CartFields
      }
   }
   ${CART_FIELDS}
`

// Carrito del usuario CON SESIÓN (guardado en el backend)
export const MY_CART: TypedDocumentNode<MyCartQuery> = gql`
   query MyCart {
      myCart {
         ...CartFields
      }
   }
   ${CART_FIELDS}
`

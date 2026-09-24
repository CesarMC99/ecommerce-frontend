import type {
   AddToCartMutation,
   AddToCartMutationVariables,
   MergeCartMutation,
   MergeCartMutationVariables,
   UpdateCartItemMutation,
   UpdateCartItemMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { CART_FIELDS } from '../fragments/cart.fragment'

// Todas devuelven el carrito COMPLETO ya recalculado: la UI no tiene que
// volver a pedirlo después de cada cambio (una petición en lugar de dos)

export const ADD_TO_CART: TypedDocumentNode<
   AddToCartMutation,
   AddToCartMutationVariables
> = gql`
   mutation AddToCart($input: CartItemInput!) {
      addToCart(input: $input) {
         ...CartFields
      }
   }
   ${CART_FIELDS}
`

// Cantidad 0 = quitar la línea
export const UPDATE_CART_ITEM: TypedDocumentNode<
   UpdateCartItemMutation,
   UpdateCartItemMutationVariables
> = gql`
   mutation UpdateCartItem($input: UpdateCartItemInput!) {
      updateCartItem(input: $input) {
         ...CartFields
      }
   }
   ${CART_FIELDS}
`

// Al iniciar sesión: el carrito de invitado se suma al de la cuenta
export const MERGE_CART: TypedDocumentNode<
   MergeCartMutation,
   MergeCartMutationVariables
> = gql`
   mutation MergeCart($items: [CartItemInput!]!) {
      mergeCart(items: $items) {
         ...CartFields
      }
   }
   ${CART_FIELDS}
`

import type {
   ConfirmOrderPaymentMutation,
   ConfirmOrderPaymentMutationVariables,
   StartCheckoutMutation,
   StartCheckoutMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { ORDER_FIELDS } from '../fragments/order.fragment'

// Crea el pedido con el carrito actual y reserva el stock. Devuelve el
// clientSecret que necesita el formulario de Stripe para cobrar
export const START_CHECKOUT: TypedDocumentNode<
   StartCheckoutMutation,
   StartCheckoutMutationVariables
> = gql`
   mutation StartCheckout($input: CheckoutInput!) {
      startCheckout(input: $input) {
         clientSecret
         order {
            ...OrderFields
         }
      }
   }
   ${ORDER_FIELDS}
`

// "Ya he pagado": el backend lo comprueba con Stripe (no se fía del
// navegador) y devuelve el pedido actualizado
export const CONFIRM_ORDER_PAYMENT: TypedDocumentNode<
   ConfirmOrderPaymentMutation,
   ConfirmOrderPaymentMutationVariables
> = gql`
   mutation ConfirmOrderPayment($orderId: ID!) {
      confirmOrderPayment(orderId: $orderId) {
         ...OrderFields
      }
   }
   ${ORDER_FIELDS}
`

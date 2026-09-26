import type {
   MyOrdersQuery,
   MyOrdersQueryVariables,
   OrderQuery,
   OrderQueryVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { ORDER_FIELDS } from '../fragments/order.fragment'

// Historial paginado ("Mis pedidos"): solo pedidos pagados
export const MY_ORDERS: TypedDocumentNode<MyOrdersQuery, MyOrdersQueryVariables> = gql`
   query MyOrders($page: Int, $pageSize: Int) {
      myOrders(page: $page, pageSize: $pageSize) {
         totalCount
         page
         totalPages
         items {
            ...OrderFields
         }
      }
   }
   ${ORDER_FIELDS}
`

// Un pedido del usuario (el backend responde NOT_FOUND si es de otra persona)
export const ORDER: TypedDocumentNode<OrderQuery, OrderQueryVariables> = gql`
   query Order($id: ID!) {
      order(id: $id) {
         ...OrderFields
      }
   }
   ${ORDER_FIELDS}
`

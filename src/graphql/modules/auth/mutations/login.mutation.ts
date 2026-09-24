import type {
   LoginMutation,
   LoginMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// El nombre de la operación ("Login") importa: Codegen lo usa para generar
// LoginMutation / LoginMutationVariables, y el errorLink lo usa para NO
// intentar un refresh cuando falla por credenciales incorrectas
export const LOGIN: TypedDocumentNode<LoginMutation, LoginMutationVariables> =
   gql`
      mutation Login($input: LoginInput!) {
         login(input: $input) {
            accessToken
            user {
               id
               name
               email
               roles
               avatarUrl
               createdAt
            }
         }
      }
   `

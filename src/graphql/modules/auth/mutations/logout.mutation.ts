import type {
   LogoutMutation,
   LogoutMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Sin variables: el backend lee el refresh token de la cookie httpOnly,
// lo revoca en la base de datos y borra la cookie. Devuelve true
export const LOGOUT: TypedDocumentNode<LogoutMutation, LogoutMutationVariables> =
   gql`
      mutation Logout {
         logout
      }
   `

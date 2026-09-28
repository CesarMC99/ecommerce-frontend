import type {
   RegisterMutation,
   RegisterMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { SESSION_USER_FIELDS } from '../fragments/session-user.fragment'

// El backend responde igual que en el login (accessToken + user) y además
// deja la cookie del refresh token: registrarse ya deja la sesión iniciada
export const REGISTER: TypedDocumentNode<
   RegisterMutation,
   RegisterMutationVariables
> = gql`
   mutation Register($input: RegisterInput!) {
      register(input: $input) {
         accessToken
         user {
            ...SessionUserFields
         }
      }
   }
   ${SESSION_USER_FIELDS}
`

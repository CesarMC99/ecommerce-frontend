// import { gql } from '@apollo/client'

// export const LOGIN_WITH_GOOGLE = gql`
//    mutation LoginWithGoogle($input: LoginWithGoogleInput!) {
//       loginWithGoogle(input: $input) {
//          accessToken
//          user {
//             id
//             name
//             email
//             roles
//             avatarUrl
//             createdAt
//          }
//       }
//    }
// `
import type {
   LoginWithGoogleMutation,
   LoginWithGoogleMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// TypedDocumentNode<Respuesta, Variables> "adjunta" los tipos de Codegen
// al documento. Así useMutation(LOGIN_WITH_GOOGLE) infiere todo solo,
// sin pasar genéricos a mano (esa firma quedó deprecada en Apollo 4)
export const LOGIN_WITH_GOOGLE: TypedDocumentNode<
   LoginWithGoogleMutation,
   LoginWithGoogleMutationVariables
> = gql`
   mutation LoginWithGoogle($input: LoginWithGoogleInput!) {
      loginWithGoogle(input: $input) {
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

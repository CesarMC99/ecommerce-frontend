import type { RefreshTokensMutation } from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Sin variables: el refresh token NO viaja como argumento,
// va en la cookie httpOnly que el navegador adjunta solo
export const REFRESH_TOKENS: TypedDocumentNode<RefreshTokensMutation> = gql`
   mutation RefreshTokens {
      refreshTokens {
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

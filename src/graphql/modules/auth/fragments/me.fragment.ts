import type { MeQuery } from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Query protegida: el backend exige "Authorization: Bearer <token>".
// Perfecta para probar el auto-refresh: si el token venció, veremos
// UNAUTHENTICATED → RefreshTokens → reintento, todo automático
export const ME: TypedDocumentNode<MeQuery> = gql`
   query Me {
      me {
         id
         name
         email
         roles
         avatarUrl
         createdAt
      }
   }
`

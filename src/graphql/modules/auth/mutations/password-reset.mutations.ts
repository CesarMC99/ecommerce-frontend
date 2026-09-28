import type {
   RequestPasswordResetMutation,
   RequestPasswordResetMutationVariables,
   ResetPasswordMutation,
   ResetPasswordMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Responde true SIEMPRE, exista o no la cuenta (no revela qué correos hay)
export const REQUEST_PASSWORD_RESET: TypedDocumentNode<
   RequestPasswordResetMutation,
   RequestPasswordResetMutationVariables
> = gql`
   mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
      requestPasswordReset(input: $input)
   }
`

// Con el token del enlace del correo; el backend cierra TODAS las sesiones
export const RESET_PASSWORD: TypedDocumentNode<
   ResetPasswordMutation,
   ResetPasswordMutationVariables
> = gql`
   mutation ResetPassword($input: ResetPasswordInput!) {
      resetPassword(input: $input)
   }
`

import type {
   ChangePasswordMutation,
   ChangePasswordMutationVariables,
   UpdateProfileMutation,
   UpdateProfileMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'
import { SESSION_USER_FIELDS } from '../fragments/session-user.fragment'

// Devuelve el usuario con los MISMOS campos que la sesión: así el nombre
// nuevo aparece en el header sin volver a pedir nada
export const UPDATE_PROFILE: TypedDocumentNode<
   UpdateProfileMutation,
   UpdateProfileMutationVariables
> = gql`
   mutation UpdateProfile($input: UpdateProfileInput!) {
      updateProfile(input: $input) {
         ...SessionUserFields
      }
   }
   ${SESSION_USER_FIELDS}
`

// Exige la contraseña actual; el backend cierra las DEMÁS sesiones
export const CHANGE_PASSWORD: TypedDocumentNode<
   ChangePasswordMutation,
   ChangePasswordMutationVariables
> = gql`
   mutation ChangePassword($input: ChangePasswordInput!) {
      changePassword(input: $input)
   }
`

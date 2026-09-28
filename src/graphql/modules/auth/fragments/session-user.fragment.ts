import { gql } from '@apollo/client'

// Los datos del usuario que guarda la sesión. TODAS las operaciones que
// devuelven al usuario (login, registro, Google, refresh, me, editar perfil)
// usan este fragment: si mañana hace falta un campo más, se añade AQUÍ y
// todas lo traen. Antes estaban copiados en 6 sitios y se desincronizaban
export const SESSION_USER_FIELDS = gql`
   fragment SessionUserFields on User {
      id
      name
      email
      roles
      avatarUrl
      hasPassword
      createdAt
   }
`

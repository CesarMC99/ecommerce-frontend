import { gql } from '@apollo/client'

export const LOGIN = gql`
   mutation Login($input: LoginInput!) {
      login(input: $input) {
         accessToken
         user {
            id
            firstName
            lastName
            email
            fullName
            roles
            isVerified
            isActive
         }
      }
   }
`

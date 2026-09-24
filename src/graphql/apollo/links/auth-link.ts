import { getAuthToken } from '@/lib/auth-token'
import { SetContextLink } from '@apollo/client/link/context'

export const authLink = new SetContextLink((prevContext, operation) => {
   const token = getAuthToken()
   return {
      headers: {
         ...prevContext.headers,
         authorization: token ? `Bearer ${token}` : '',
      },
   }
})

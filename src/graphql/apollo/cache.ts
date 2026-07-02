import { InMemoryCache } from '@apollo/client-integration-nextjs'

export const cache = new InMemoryCache({
   typePolicies: {
      Query: {},
   },
})

import {
   ApolloClient,
   registerApolloClient,
} from '@apollo/client-integration-nextjs'
import { cache } from './cache'
import { apolloLink } from './links'

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
   return new ApolloClient({
      cache: cache,
      link: apolloLink,
   })
})

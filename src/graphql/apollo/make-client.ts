import { ApolloClient } from '@apollo/client-integration-nextjs'
import { cache } from './cache'
import { apolloLink } from './links'

export function makeClient() {
   return new ApolloClient({
      cache: cache,
      link: apolloLink,
   })
}

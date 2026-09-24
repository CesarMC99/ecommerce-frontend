import { ApolloClient } from '@apollo/client-integration-nextjs'
import { makeCache } from './cache'
import { apolloLink } from './links'

// Cliente del NAVEGADOR (lo usa ApolloWrapper en los Client Components)
export function makeClient() {
   return new ApolloClient({
      cache: makeCache(),
      link: apolloLink,
   })
}

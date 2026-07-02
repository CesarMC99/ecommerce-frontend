import { ApolloLink } from '@apollo/client'
import { authLink } from './auth-link'
import { errorLink } from './error-link'
import { uploadLink } from './upload-link'

export const apolloLink = ApolloLink.from([errorLink, authLink, uploadLink])

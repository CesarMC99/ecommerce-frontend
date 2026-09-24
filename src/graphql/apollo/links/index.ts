import { ApolloLink } from '@apollo/client'
import { authLink } from './auth-link'
import { errorLink } from './error-link'
import { httpLink } from './http-link'

// Cadena del NAVEGADOR: errores/refresh → token → petición
export const apolloLink = ApolloLink.from([errorLink, authLink, httpLink])

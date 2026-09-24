import {
   ApolloClient,
   registerApolloClient,
} from '@apollo/client-integration-nextjs'
import { makeCache } from './cache'
import { httpLink } from './links/http-link'

// Cliente del SERVIDOR (Server Components). registerApolloClient crea uno
// NUEVO por cada petición, con su propia caché (ver makeCache).
//
// Usa solo httpLink, sin authLink ni errorLink: esos dos dependen del access
// token que vive en la MEMORIA DEL NAVEGADOR, que el servidor no tiene. Por
// eso aquí solo se piden datos PÚBLICOS (catálogo, productos). Lo que
// dependa del usuario (perfil, pedidos) se pide desde el navegador
export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
   return new ApolloClient({
      cache: makeCache(),
      link: httpLink,
   })
})

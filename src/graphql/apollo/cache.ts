import { InMemoryCache } from '@apollo/client-integration-nextjs'

// FUNCIÓN que crea una caché nueva, no una instancia exportada.
// Una instancia compartida (`export const cache = new InMemoryCache()`) en
// el SERVIDOR sería la misma para todas las peticiones de todos los usuarios:
// los datos de una persona podrían acabar en la página de otra. Cada cliente
// (uno por navegador, uno por petición en el servidor) crea la suya
export const makeCache = () =>
   new InMemoryCache({
      typePolicies: {
         Query: {},
      },
   })

import type {
   SearchCitiesQuery,
   SearchCitiesQueryVariables,
   ShippingCountriesQuery,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Países a los que envía la tienda (con su prefijo telefónico). La lista
// la decide el backend: el formulario nunca ofrece un país que luego se
// rechazaría al pagar
export const SHIPPING_COUNTRIES: TypedDocumentNode<ShippingCountriesQuery> = gql`
   query ShippingCountries {
      shippingCountries {
         code
         name
         dialCode
      }
   }
`

// Ciudades de un país que contienen lo escrito (sin distinguir tildes).
// El listado completo pesa varios MB: por eso se busca en el servidor
export const SEARCH_CITIES: TypedDocumentNode<
   SearchCitiesQuery,
   SearchCitiesQueryVariables
> = gql`
   query SearchCities($countryCode: String!, $search: String!, $limit: Int) {
      searchCities(countryCode: $countryCode, search: $search, limit: $limit) {
         name
      }
   }
`

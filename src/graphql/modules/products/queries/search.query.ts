import type {
   SearchSuggestionsQuery,
   SearchSuggestionsQueryVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Sugerencias del buscador del header: pocos productos y pocos campos (se
// pide mientras se escribe, así que cuanto más ligera, mejor). Los
// resultados completos los muestra el catálogo con ?q=
export const SEARCH_SUGGESTIONS: TypedDocumentNode<
   SearchSuggestionsQuery,
   SearchSuggestionsQueryVariables
> = gql`
   query SearchSuggestions($search: String!, $limit: Int!) {
      products(
         filter: { search: $search }
         sort: FEATURED
         page: 1
         pageSize: $limit
      ) {
         totalCount
         items {
            id
            slug
            name
            price
            compareAtPrice
            mainImage {
               publicId
               alt
            }
         }
      }
   }
`

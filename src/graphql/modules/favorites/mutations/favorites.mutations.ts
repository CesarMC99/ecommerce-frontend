import type {
   MergeFavoritesMutation,
   MergeFavoritesMutationVariables,
   ToggleFavoriteMutation,
   ToggleFavoriteMutationVariables,
} from '@/graphql/generated/graphql'
import { gql, type TypedDocumentNode } from '@apollo/client'

// Devuelven la lista de ids ACTUALIZADA: se escribe en la caché de
// MyFavoriteIds y todos los corazones cambian a la vez

export const TOGGLE_FAVORITE: TypedDocumentNode<
   ToggleFavoriteMutation,
   ToggleFavoriteMutationVariables
> = gql`
   mutation ToggleFavorite($productId: ID!) {
      toggleFavorite(productId: $productId)
   }
`

// Al iniciar sesión: los favoritos de invitado se unen a los de la cuenta
export const MERGE_FAVORITES: TypedDocumentNode<
   MergeFavoritesMutation,
   MergeFavoritesMutationVariables
> = gql`
   mutation MergeFavorites($productIds: [ID!]!) {
      mergeFavorites(productIds: $productIds)
   }
`

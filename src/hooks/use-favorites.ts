'use client'

import { TOGGLE_FAVORITE } from '@/graphql/modules/favorites/mutations/favorites.mutations'
import { MY_FAVORITE_IDS } from '@/graphql/modules/favorites/queries/favorites.queries'
import { useSession } from '@/providers/SessionProvider'
import { useLoginPromptStore } from '@/stores/login-prompt-store'
import { useMutation, useQuery } from '@apollo/client/react'

/**
 * EL punto de entrada a los favoritos.
 *
 * Los favoritos EXIGEN sesión (se guardan en la cuenta). Si un invitado
 * pulsa un corazón, en vez de guardar se abre el modal que le invita a
 * iniciar sesión; al volver, el producto se guarda automáticamente.
 */
export function useFavorites() {
   const { status } = useSession()
   const isAuthenticated = status === 'authenticated'
   const openLoginPrompt = useLoginPromptStore((state) => state.openLoginPrompt)

   const myFavoritesQuery = useQuery(MY_FAVORITE_IDS, {
      skip: !isAuthenticated,
      fetchPolicy: 'cache-and-network',
   })

   const [toggleFavoriteMutation] = useMutation(TOGGLE_FAVORITE, {
      // La mutation devuelve la lista nueva: se guarda en la caché y todos
      // los corazones (tarjetas, ficha, header) se actualizan a la vez
      update: (cache, { data }) => {
         if (data) {
            cache.writeQuery({
               query: MY_FAVORITE_IDS,
               data: { myFavoriteIds: data.toggleFavorite },
            })
         }
      },
   })

   const favoriteIds = myFavoritesQuery.data?.myFavoriteIds ?? []

   const isFavorite = (productId: string) => favoriteIds.includes(productId)

   /** Marca o desmarca. Sin sesión, abre el modal de "inicia sesión". */
   const toggle = async (productId: string) => {
      if (!isAuthenticated) {
         openLoginPrompt(productId)
         return
      }
      await toggleFavoriteMutation({ variables: { productId } })
   }

   return {
      favoriteIds,
      count: favoriteIds.length,
      status,
      isLoading: isAuthenticated && myFavoritesQuery.loading && !myFavoritesQuery.data,
      isFavorite,
      toggle,
   }
}

'use client'

import { MERGE_CART } from '@/graphql/modules/cart/mutations/cart.mutations'
import { MY_CART } from '@/graphql/modules/cart/queries/cart.queries'
import { MERGE_FAVORITES } from '@/graphql/modules/favorites/mutations/favorites.mutations'
import { MY_FAVORITE_IDS } from '@/graphql/modules/favorites/queries/favorites.queries'
import { useMergeOnLogin } from '@/hooks/use-merge-on-login'
import { useCartStore } from '@/stores/cart-store'
import { PENDING_FAVORITE_KEY } from '@/stores/login-prompt-store'
import { useMutation } from '@apollo/client/react'
import { useEffect, useState } from 'react'

// Lectura/borrado seguros de sessionStorage (puede estar bloqueado en
// navegación privada estricta: entonces simplemente no hay pendiente)
const readPendingFavorite = (): string[] => {
   try {
      const productId = sessionStorage.getItem(PENDING_FAVORITE_KEY)
      return productId ? [productId] : []
   } catch {
      return []
   }
}
const clearPendingFavorite = () => {
   try {
      sessionStorage.removeItem(PENDING_FAVORITE_KEY)
   } catch {
      // Nada que limpiar si no hay acceso a sessionStorage
   }
}

/**
 * Componente "invisible" que, al iniciar sesión, sube a la cuenta lo que el
 * usuario hizo antes de entrar:
 *  - CARRITO: todo el carrito de invitado (localStorage) se fusiona.
 *  - FAVORITOS: exigen sesión, así que no hay lista de invitado; solo el
 *    producto cuyo corazón pulsó antes de ir al login (sessionStorage), que
 *    se guarda automáticamente para que no tenga que buscarlo otra vez.
 *
 * Vive en el layout raíz: funciona aunque el login ocurra en /login.
 */
export function GuestDataSync() {
   const cartHydrated = useCartStore((state) => state.hasHydrated)
   // sessionStorage solo existe en el navegador: se lee tras montar
   const [isMounted, setIsMounted] = useState(false)

   const [mergeCart] = useMutation(MERGE_CART, {
      update: (cache, { data }) => {
         if (data) {
            cache.writeQuery({ query: MY_CART, data: { myCart: data.mergeCart } })
         }
      },
   })
   // mergeFavorites y no toggleFavorite: AÑADE sin riesgo. Si el producto
   // ya estaba en favoritos, un toggle lo quitaría
   const [mergeFavorites] = useMutation(MERGE_FAVORITES, {
      update: (cache, { data }) => {
         if (data) {
            cache.writeQuery({
               query: MY_FAVORITE_IDS,
               data: { myFavoriteIds: data.mergeFavorites },
            })
         }
      },
   })

   useEffect(() => {
      // Leer localStorage DESPUÉS de montar: el servidor no lo tiene y el
      // primer render debe coincidir con su HTML (sin error de hidratación)
      void useCartStore.persist.rehydrate()
      setIsMounted(true)
   }, [])

   useMergeOnLogin({
      label: 'carrito',
      hasHydrated: cartHydrated,
      // getState(): el valor ACTUAL, sin suscribirse a sus cambios
      getGuestData: () => useCartStore.getState().guestItems,
      merge: (items) => mergeCart({ variables: { items } }),
      clear: () => useCartStore.getState().clearGuestItems(),
   })

   useMergeOnLogin({
      label: 'favorito pendiente',
      hasHydrated: isMounted,
      getGuestData: readPendingFavorite,
      merge: (productIds) => mergeFavorites({ variables: { productIds } }),
      clear: clearPendingFavorite,
   })

   return null
}

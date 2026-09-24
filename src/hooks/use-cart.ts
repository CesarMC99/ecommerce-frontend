'use client'

import type {
   CartFieldsFragment,
   CartItemInput,
} from '@/graphql/generated/graphql'
import {
   ADD_TO_CART,
   UPDATE_CART_ITEM,
} from '@/graphql/modules/cart/mutations/cart.mutations'
import { CART_QUOTE, MY_CART } from '@/graphql/modules/cart/queries/cart.queries'
import { useSession } from '@/providers/SessionProvider'
import { useCartStore } from '@/stores/cart-store'
import type { ApolloCache } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'

// Tras cada mutation, el backend devuelve el carrito COMPLETO recalculado.
// Se escribe directamente en la caché de la query MyCart: todos los
// componentes que la leen (header, drawer, página) se actualizan solos,
// sin una segunda petición para "volver a pedir el carrito"
const writeMyCart = (cache: ApolloCache, cart: CartFieldsFragment) =>
   cache.writeQuery({ query: MY_CART, data: { myCart: cart } })

/**
 * EL punto de entrada al carrito para toda la UI.
 *
 * Esconde la diferencia entre invitado y usuario con sesión: los
 * componentes llaman a addItem / setQuantity sin saber dónde se guarda.
 *  - Invitado: las líneas viven en Zustand (localStorage) y se envían a
 *    `cartQuote` para obtener precios.
 *  - Con sesión: todo va al backend (myCart + mutations).
 */
export function useCart() {
   const { status } = useSession()
   const isAuthenticated = status === 'authenticated'

   const guestItems = useCartStore((state) => state.guestItems)
   const hasHydrated = useCartStore((state) => state.hasHydrated)
   const addGuestItem = useCartStore((state) => state.addGuestItem)
   const setGuestQuantity = useCartStore((state) => state.setGuestQuantity)
   const setDrawerOpen = useCartStore((state) => state.setDrawerOpen)

   // Invitado: solo cuando ya se leyó localStorage y hay algo que calcular
   const guestQuery = useQuery(CART_QUOTE, {
      variables: { items: guestItems },
      skip: status !== 'unauthenticated' || !hasHydrated || guestItems.length === 0,
      // Muestra lo que haya en caché al instante y lo refresca en segundo
      // plano (un precio pudo cambiar desde la última vez)
      fetchPolicy: 'cache-and-network',
   })

   const myCartQuery = useQuery(MY_CART, {
      skip: !isAuthenticated,
      fetchPolicy: 'cache-and-network',
   })

   const [addToCart] = useMutation(ADD_TO_CART, {
      update: (cache, { data }) => {
         if (data) writeMyCart(cache, data.addToCart)
      },
   })
   const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
      update: (cache, { data }) => {
         if (data) writeMyCart(cache, data.updateCartItem)
      },
   })

   // previousData: mientras se recalcula el presupuesto tras un cambio,
   // se sigue mostrando el anterior en lugar de un parpadeo a "vacío"
   const guestCart =
      guestItems.length === 0
         ? null
         : (guestQuery.data ?? guestQuery.previousData)?.cartQuote ?? null
   const cart = isAuthenticated ? (myCartQuery.data?.myCart ?? null) : guestCart

   // Contador del header. Para invitados, mientras llega el presupuesto se
   // usa la suma local: así el número aparece al instante al añadir
   const itemCount =
      cart?.itemCount ??
      (isAuthenticated
         ? 0
         : guestItems.reduce((total, line) => total + line.quantity, 0))

   const isReady =
      status !== 'loading' && (isAuthenticated ? !myCartQuery.loading || !!cart : hasHydrated)

   /** Añade al carrito y abre el drawer. Lanza el error del backend si falla. */
   const addItem = async (item: CartItemInput) => {
      if (isAuthenticated) {
         await addToCart({ variables: { input: item } })
      } else {
         addGuestItem(item)
      }
      setDrawerOpen(true)
   }

   /** Cambia la cantidad de una línea; 0 la quita. */
   const setQuantity = async (
      productId: string,
      size: string,
      quantity: number,
   ) => {
      if (isAuthenticated) {
         await updateCartItem({ variables: { input: { productId, size, quantity } } })
      } else {
         setGuestQuantity(productId, size, quantity)
      }
   }

   const removeItem = (productId: string, size: string) =>
      setQuantity(productId, size, 0)

   return {
      cart,
      itemCount,
      isReady,
      error: isAuthenticated ? myCartQuery.error : guestQuery.error,
      addItem,
      setQuantity,
      removeItem,
   }
}

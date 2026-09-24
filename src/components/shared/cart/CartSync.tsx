'use client'

import { MERGE_CART } from '@/graphql/modules/cart/mutations/cart.mutations'
import { MY_CART } from '@/graphql/modules/cart/queries/cart.queries'
import { useSession } from '@/providers/SessionProvider'
import { useCartStore } from '@/stores/cart-store'
import { useMutation } from '@apollo/client/react'
import { useEffect, useRef } from 'react'

/**
 * Componente "invisible" (no pinta nada) que mantiene el carrito sincronizado:
 *  1. Lee el carrito de invitado de localStorage DESPUÉS de montar.
 *  2. Al iniciar sesión, fusiona ese carrito con el de la cuenta y lo borra
 *     del navegador (a partir de ahí, la fuente de verdad es el backend).
 *
 * Vive en el layout raíz: así la fusión ocurre aunque el login se haga en
 * /login, fuera del layout de la tienda.
 */
export function CartSync() {
   const { status } = useSession()
   const hasHydrated = useCartStore((state) => state.hasHydrated)
   const clearGuestItems = useCartStore((state) => state.clearGuestItems)
   // Evita fusionar DOS veces (React en desarrollo ejecuta los efectos dos
   // veces; sin este freno, las cantidades se sumarían por duplicado)
   const isMergingRef = useRef(false)

   const [mergeCart] = useMutation(MERGE_CART, {
      update: (cache, { data }) => {
         if (data) cache.writeQuery({ query: MY_CART, data: { myCart: data.mergeCart } })
      },
   })

   useEffect(() => {
      // Leer localStorage aquí y no al crear el store: evita que el primer
      // render del navegador difiera del HTML del servidor
      void useCartStore.persist.rehydrate()
   }, [])

   useEffect(() => {
      if (status !== 'authenticated' || !hasHydrated || isMergingRef.current) {
         return
      }
      // getState(): se lee el valor ACTUAL sin suscribirse a él (este efecto
      // no debe repetirse cada vez que cambie el carrito de invitado)
      const guestItems = useCartStore.getState().guestItems
      if (guestItems.length === 0) return

      isMergingRef.current = true
      mergeCart({ variables: { items: guestItems } })
         // Solo se borra el carrito local si la fusión FUNCIONÓ: si el
         // backend falla, el invitado no pierde lo que había añadido
         .then(() => clearGuestItems())
         .catch((error: unknown) =>
            console.error('[carrito] No se pudo fusionar el carrito:', error),
         )
         .finally(() => {
            isMergingRef.current = false
         })
   }, [status, hasHydrated, mergeCart, clearGuestItems])

   return null
}

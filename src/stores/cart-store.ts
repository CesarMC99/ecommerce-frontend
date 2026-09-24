import type { CartItemInput } from '@/graphql/generated/graphql'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// Mismo tope que el backend. El backend es quien manda (volverá a acotar),
// pero repetirlo aquí evita que un invitado acumule 50 unidades en local
export const MAX_QUANTITY_PER_LINE = 10

interface CartState {
   /**
    * Carrito del INVITADO: solo qué quiere comprar (producto, talla,
    * cantidad), nunca precios. Los precios los calcula siempre el backend.
    * Con sesión, el carrito vive en el backend y esto queda vacío.
    */
   guestItems: CartItemInput[]
   /** ¿Ya se leyó localStorage? Hasta entonces el carrito "no se sabe" */
   hasHydrated: boolean
   isDrawerOpen: boolean

   addGuestItem: (item: CartItemInput) => void
   /** Cantidad 0 = quitar la línea */
   setGuestQuantity: (productId: string, size: string, quantity: number) => void
   clearGuestItems: () => void
   setDrawerOpen: (open: boolean) => void
}

const isSameLine = (
   line: CartItemInput,
   productId: string,
   size: string,
) => line.productId === productId && line.size === size

const clamp = (quantity: number) =>
   Math.min(MAX_QUANTITY_PER_LINE, Math.max(0, Math.floor(quantity)))

// ¿Por qué Zustand y no React Context? El carrito lo leen muchos sitios
// a la vez (contador del header, drawer, página, botones) y cambia a
// menudo. Con Context, CADA cambio re-renderizaría todo lo que cuelga del
// provider; con Zustand, cada componente se suscribe SOLO al dato que usa
export const useCartStore = create<CartState>()(
   persist(
      (set) => ({
         guestItems: [],
         hasHydrated: false,
         isDrawerOpen: false,

         addGuestItem: (item) =>
            set((state) => {
               const exists = state.guestItems.some((line) =>
                  isSameLine(line, item.productId, item.size),
               )
               // La misma prenda y talla SUMA unidades (igual que el backend)
               return {
                  guestItems: exists
                     ? state.guestItems.map((line) =>
                          isSameLine(line, item.productId, item.size)
                             ? {
                                  ...line,
                                  quantity: clamp(line.quantity + item.quantity),
                               }
                             : line,
                       )
                     : [
                          ...state.guestItems,
                          { ...item, quantity: clamp(item.quantity) },
                       ],
               }
            }),

         setGuestQuantity: (productId, size, quantity) =>
            set((state) => ({
               guestItems:
                  clamp(quantity) === 0
                     ? state.guestItems.filter(
                          (line) => !isSameLine(line, productId, size),
                       )
                     : state.guestItems.map((line) =>
                          isSameLine(line, productId, size)
                             ? { ...line, quantity: clamp(quantity) }
                             : line,
                       ),
            })),

         clearGuestItems: () => set({ guestItems: [] }),
         setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      }),
      {
         name: 'ambar-cart',
         // localStorage: el carrito de invitado sobrevive a recargar y a
         // cerrar el navegador (sessionStorage se borraría al cerrarlo)
         storage: createJSONStorage(() => localStorage),
         // Solo se guardan las líneas: "drawer abierto" no debe persistir
         partialize: (state) => ({ guestItems: state.guestItems }),
         // NO leer localStorage al crear el store: en el servidor no existe
         // y, si el primer render del navegador ya tuviera el carrito, no
         // coincidiría con el HTML del servidor (error de hidratación).
         // Se lee a propósito tras el montaje, en <CartSync />
         skipHydration: true,
         onRehydrateStorage: () => () => {
            useCartStore.setState({ hasHydrated: true })
         },
         // Si algún día cambia la forma de lo guardado, subir la versión
         // permite migrar los carritos antiguos en vez de romperlos
         version: 1,
      },
   ),
)

'use client'

import { useSession } from '@/providers/SessionProvider'
import { useEffect, useRef } from 'react'

interface MergeOnLoginOptions<T> {
   /** Nombre para los logs ("carrito", "favoritos") */
   label: string
   /** ¿Ya se leyó localStorage? Antes no se sabe qué hay que fusionar */
   hasHydrated: boolean
   /** Lee los datos del invitado EN EL MOMENTO (sin suscribirse) */
   getGuestData: () => T[]
   /** Envía los datos al backend */
   merge: (data: T[]) => Promise<unknown>
   /** Borra los datos locales tras una fusión correcta */
   clear: () => void
}

/**
 * Lógica común a carrito y favoritos: al iniciar sesión, lo que el
 * invitado guardó en el navegador se sube a su cuenta y se borra en local.
 *
 * Reglas (iguales para los dos, por eso viven en UN solo sitio):
 *  - Solo con sesión y cuando ya se leyó localStorage
 *  - Nunca dos fusiones a la vez (React en desarrollo ejecuta los efectos
 *    dos veces: sin freno, las cantidades se sumarían por duplicado)
 *  - Solo se borra lo local si el backend confirmó la fusión
 */
export function useMergeOnLogin<T>({
   label,
   hasHydrated,
   getGuestData,
   merge,
   clear,
}: MergeOnLoginOptions<T>) {
   const { status } = useSession()
   const isMergingRef = useRef(false)

   useEffect(() => {
      if (status !== 'authenticated' || !hasHydrated || isMergingRef.current) {
         return
      }
      const guestData = getGuestData()
      if (guestData.length === 0) return

      isMergingRef.current = true
      merge(guestData)
         .then(() => clear())
         .catch((error: unknown) =>
            console.error(`[${label}] No se pudo fusionar:`, error),
         )
         .finally(() => {
            isMergingRef.current = false
         })
      // Las funciones cambian de identidad en cada render; el efecto solo
      // debe reaccionar al cambio de sesión o a la lectura de localStorage
   }, [status, hasHydrated])
}

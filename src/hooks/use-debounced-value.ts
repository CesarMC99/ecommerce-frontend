'use client'

import { useEffect, useState } from 'react'

/**
 * Devuelve `value` solo cuando lleva `delay` ms sin cambiar.
 *
 * Al escribir "Madrid" en un buscador, sin esto se harían 6 peticiones
 * (M, Ma, Mad...). Con debounce se hace UNA, cuando el usuario para de
 * teclear un instante.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
   const [debounced, setDebounced] = useState(value)

   useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay)
      // Si el valor cambia antes de tiempo, se cancela el temporizador anterior
      return () => clearTimeout(timer)
   }, [value, delay])

   return debounced
}

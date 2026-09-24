'use client'
// Client Component: el slider tiene estado (su valor mientras se arrastra)

import { formatPrice } from '@/lib/format-price'
import { catalogRoute, type CatalogFilters } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useId, useState, useTransition } from 'react'

interface PriceFilterProps {
   filters: CatalogFilters
   /** Límites del slider en euros (vienen de las facetas del backend) */
   min: number
   max: number
}

export function PriceFilter({ filters, min, max }: PriceFilterProps) {
   const router = useRouter()
   // useTransition: mientras el servidor prepara la nueva página, isPending
   // es true y se puede indicar que "está cargando" sin congelar la UI
   const [isPending, startTransition] = useTransition()
   // Sin filtro de precio, el slider empieza al máximo (= "sin límite")
   const [value, setValue] = useState(filters.precio ?? max)
   // Los filtros se pintan DOS veces (móvil y escritorio): un id fijo como
   // "price-filter" quedaría repetido y el <label> apuntaría al slider
   // equivocado. useId genera uno único por cada instancia
   const inputId = useId()

   // Se navega al SOLTAR el slider, no mientras se arrastra: si no, cada
   // píxel del recorrido lanzaría una petición al servidor (decenas por
   // segundo) para acabar mostrando solo la última
   const applyPrice = () => {
      const current = filters.precio ?? max
      if (value === current) return

      const href = catalogRoute({
         ...filters,
         // En el máximo no hay límite real: se quita el filtro de la URL
         precio: value >= max ? undefined : value,
         pagina: undefined,
      })
      // scroll: false → la página no salta arriba al cambiar el filtro
      startTransition(() => router.push(href, { scroll: false }))
   }

   return (
      <div>
         <label
            htmlFor={inputId}
            className="mb-3 block text-xs tracking-[0.1em] text-brown-1"
         >
            PRECIO · HASTA {formatPrice(value * 100).toUpperCase()}
            {isPending && <span className="ml-1 opacity-60">…</span>}
         </label>
         <input
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={1}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            // Ratón/táctil (soltar) y teclado (flechas → soltar la tecla)
            onPointerUp={applyPrice}
            onKeyUp={applyPrice}
            className="w-full cursor-pointer accent-coral-principal"
         />
         <div className="mt-1 flex justify-between text-[11px] text-brown-1">
            <span>{formatPrice(min * 100)}</span>
            <span>{formatPrice(max * 100)}</span>
         </div>
      </div>
   )
}

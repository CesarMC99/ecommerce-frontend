'use client'

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import {
   CATALOG_SORTS,
   catalogRoute,
   type CatalogFilters,
   type CatalogSort,
} from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useId, useTransition } from 'react'

const SORT_LABELS: Record<CatalogSort, string> = {
   destacados: 'Destacados',
   novedades: 'Más recientes',
   'precio-asc': 'Precio: menor a mayor',
   'precio-desc': 'Precio: mayor a menor',
   valorados: 'Mejor valorados',
}

// Type guard: Radix entrega el valor como string genérico; esto confirma
// que es uno de nuestros órdenes antes de usarlo (sin `as` a ciegas)
const isCatalogSort = (value: string): value is CatalogSort =>
   (CATALOG_SORTS as readonly string[]).includes(value)

interface SortSelectProps {
   filters: CatalogFilters
}

export function SortSelect({ filters }: SortSelectProps) {
   const router = useRouter()
   const [isPending, startTransition] = useTransition()
   const labelId = useId()

   const handleChange = (value: string) => {
      if (!isCatalogSort(value)) return
      const href = catalogRoute({
         ...filters,
         orden: value,
         // Cambiar el orden reordena TODO: la página 3 ya no tiene los
         // mismos productos, así que se vuelve a la 1
         pagina: undefined,
      })
      startTransition(() => router.push(href, { scroll: false }))
   }

   return (
      <div className="flex items-center gap-2.5">
         <span
            id={labelId}
            className="text-[13px] text-brown-1"
         >
            Ordenar por
         </span>
         <Select
            value={filters.orden ?? 'destacados'}
            onValueChange={handleChange}
            disabled={isPending}
         >
            <SelectTrigger
               // Asocia el texto "Ordenar por" al control para lectores de pantalla
               aria-labelledby={labelId}
               className="min-w-[200px]"
            >
               <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
               {CATALOG_SORTS.map((sort) => (
                  <SelectItem
                     key={sort}
                     value={sort}
                  >
                     {SORT_LABELS[sort]}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   )
}

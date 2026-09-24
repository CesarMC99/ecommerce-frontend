import { catalogRoute, type CatalogFilters } from '@/lib/routes'
import Link from 'next/link'

interface CatalogEmptyProps {
   filters: CatalogFilters
}

// Estado vacío: nunca dejar al usuario ante un hueco en blanco. Se explica
// qué pasó y se ofrece la salida (limpiar filtros) en un clic
export function CatalogEmpty({ filters }: CatalogEmptyProps) {
   return (
      <div className="px-5 py-[90px] text-center text-brown-1">
         <p
            aria-hidden
            className="mb-3.5 text-[34px] opacity-40"
         >
            ∅
         </p>
         <p className="mb-2 font-bricolage-semibold text-xl text-brown-principal">
            Sin resultados
         </p>
         <p className="mb-5 text-sm">
            Prueba a ajustar los filtros o el rango de precio.
         </p>
         <Link
            href={catalogRoute({ orden: filters.orden })}
            className="inline-block bg-brown-principal px-6 py-3 text-[13px] text-neutro-2 transition-colors hover:bg-brown-2"
         >
            Limpiar filtros
         </Link>
      </div>
   )
}

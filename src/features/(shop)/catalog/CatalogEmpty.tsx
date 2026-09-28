import { catalogRoute, type CatalogFilters } from '@/lib/routes'
import Link from 'next/link'
import { hasActiveFilters } from './catalog-params'

interface CatalogEmptyProps {
   filters: CatalogFilters
}

// Estado vacío: nunca dejar al usuario ante un hueco en blanco. Se explica
// qué pasó y se ofrece la salida más probable en un clic
export function CatalogEmpty({ filters }: CatalogEmptyProps) {
   // Con búsqueda Y filtros, lo más probable es que sobren los filtros:
   // primero se ofrece quitarlos conservando lo que buscaba
   const searchOnly = filters.q && !hasActiveFilters(filters)

   return (
      <div className="px-5 py-[90px] text-center text-brown-1">
         <p
            aria-hidden
            className="mb-3.5 text-[34px] opacity-40"
         >
            ∅
         </p>
         <p className="mb-2 font-bricolage-semibold text-xl text-brown-principal">
            {filters.q ? `Nada para «${filters.q}»` : 'Sin resultados'}
         </p>
         <p className="mb-5 text-sm">
            {searchOnly
               ? 'Revisa cómo está escrito o prueba con otra palabra (abrigo, lino, cuero…).'
               : 'Prueba a ajustar los filtros o el rango de precio.'}
         </p>
         <Link
            href={
               searchOnly
                  ? catalogRoute({ orden: filters.orden })
                  : catalogRoute({ q: filters.q, orden: filters.orden })
            }
            className="inline-block bg-brown-principal px-6 py-3 text-[13px] text-neutro-2 transition-colors hover:bg-brown-2"
         >
            {searchOnly ? 'Ver todo el catálogo' : 'Limpiar filtros'}
         </Link>
      </div>
   )
}

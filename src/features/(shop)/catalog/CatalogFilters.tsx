import type { CatalogQuery } from '@/graphql/generated/graphql'
import {
   catalogRoute,
   type CatalogCategory,
   type CatalogFilters as Filters,
} from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { hasActiveFilters } from './catalog-params'
import { PriceFilter } from './PriceFilter'

type Facets = CatalogQuery['productFacets']

interface CatalogFiltersProps {
   filters: Filters
   facets: Facets
}

const CATEGORY_OPTIONS: { label: string; value?: CatalogCategory }[] = [
   { label: 'Todo' },
   { label: 'Mujer', value: 'mujer' },
   { label: 'Hombre', value: 'hombre' },
   { label: 'Accesorios', value: 'accesorios' },
]

// Valoraciones mínimas ofrecidas. El diseño proponía 5 / 4+ / 3+, pero con
// notas reales entre 4,4 y 4,9 "5 estrellas" daría siempre 0 resultados
const RATING_OPTIONS = [4.5, 4, 3]

/**
 * URL del catálogo cambiando UN filtro y conservando el resto.
 * La página vuelve SIEMPRE a la 1: si estabas en la página 3 y filtras por
 * "Hombre", puede que ahora solo haya 1 página (y la 3 estaría vacía)
 */
const withFilter = (filters: Filters, change: Partial<Filters>) =>
   catalogRoute({ ...filters, ...change, pagina: undefined })

// Server Component: casi todos los filtros son ENLACES (<Link>), no botones
// con JavaScript. Ventajas: funcionan con clic derecho → "abrir en pestaña
// nueva", Google puede rastrear cada combinación, y no envían JS al
// navegador. Solo el slider de precio necesita ser interactivo (cliente)
export function CatalogFilters({ filters, facets }: CatalogFiltersProps) {
   // Precios de la API en céntimos → euros enteros para el slider
   const minPrice = Math.floor(facets.minPrice / 100)
   const maxPrice = Math.ceil(facets.maxPrice / 100)

   return (
      <div className="flex flex-col gap-[26px]">
         <div className="flex items-center justify-between">
            <h2 className="font-bricolage-semibold text-[17px] text-brown-principal">
               Filtros
            </h2>
            {hasActiveFilters(filters) && (
               // Limpia los filtros pero CONSERVA el orden elegido
               <Link
                  href={catalogRoute({ orden: filters.orden })}
                  className="text-xs text-coral-principal hover:underline"
               >
                  Limpiar
               </Link>
            )}
         </div>

         <FilterGroup title="CATEGORÍA">
            <ul className="flex flex-col gap-[9px]">
               {CATEGORY_OPTIONS.map((option) => {
                  const isActive = filters.categoria === option.value
                  return (
                     <li key={option.label}>
                        <Link
                           href={withFilter(filters, { categoria: option.value })}
                           // aria-current: el lector de pantalla anuncia
                           // cuál es la opción seleccionada
                           aria-current={isActive ? 'true' : undefined}
                           className="flex items-center gap-[9px] text-sm text-brown-2 hover:text-brown-principal"
                        >
                           <span className="flex size-3.5 items-center justify-center rounded-full border border-beige-3">
                              {isActive && (
                                 <span className="size-[7px] rounded-full bg-coral-principal" />
                              )}
                           </span>
                           {option.label}
                        </Link>
                     </li>
                  )
               })}
            </ul>
         </FilterGroup>

         {/* Sin rango válido (catálogo vacío) el slider no tiene sentido */}
         {maxPrice > minPrice && (
            <PriceFilter
               // `key`: si el precio cambia desde fuera (p. ej. "Limpiar"),
               // React crea el slider de nuevo con el valor correcto en vez
               // de quedarse con el que tenía guardado en su estado interno
               key={filters.precio ?? 'sin-limite'}
               filters={filters}
               min={minPrice}
               max={maxPrice}
            />
         )}

         <FilterGroup title="COLOR">
            <ul className="flex flex-wrap gap-2.5">
               {facets.colors.map((color) => {
                  const isActive =
                     filters.color?.toLowerCase() === color.name.toLowerCase()
                  return (
                     <li key={color.name}>
                        <Link
                           // Pulsar el color activo lo QUITA (toggle)
                           href={withFilter(filters, {
                              color: isActive ? undefined : color.name,
                           })}
                           aria-label={color.name}
                           aria-current={isActive ? 'true' : undefined}
                           title={color.name}
                           className={cn(
                              'block size-[26px] rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-transform hover:scale-110',
                              // Doble anillo: hueco claro + borde oscuro
                              isActive &&
                                 'shadow-[0_0_0_2px_var(--color-neutro-2),0_0_0_4px_var(--color-brown-principal)]',
                           )}
                           // El color viene de la base de datos: no puede ser
                           // una clase de Tailwind (se generan al compilar)
                           style={{ backgroundColor: color.hex }}
                        />
                     </li>
                  )
               })}
            </ul>
         </FilterGroup>

         <FilterGroup title="TALLA">
            <ul className="flex flex-wrap gap-2">
               {facets.sizes.map((size) => {
                  const isActive = filters.talla === size
                  return (
                     <li key={size}>
                        <Link
                           href={withFilter(filters, {
                              talla: isActive ? undefined : size,
                           })}
                           aria-current={isActive ? 'true' : undefined}
                           className={cn(
                              'block min-w-9 rounded border px-1 py-[7px] text-center text-xs transition-colors',
                              isActive
                                 ? 'border-brown-principal bg-brown-principal text-neutro-2'
                                 : 'border-beige-2 bg-neutro-1 text-brown-2 hover:border-brown-principal',
                           )}
                        >
                           {size}
                        </Link>
                     </li>
                  )
               })}
            </ul>
         </FilterGroup>

         <FilterGroup title="VALORACIÓN">
            <ul className="flex flex-col gap-[9px] text-[13px] text-brown-1">
               {RATING_OPTIONS.map((rating) => {
                  const isActive = filters.valoracion === rating
                  const fullStars = Math.floor(rating)
                  return (
                     <li key={rating}>
                        <Link
                           href={withFilter(filters, {
                              valoracion: isActive ? undefined : rating,
                           })}
                           aria-current={isActive ? 'true' : undefined}
                           className={cn(
                              'hover:text-brown-principal',
                              isActive && 'font-helvetica-bold text-brown-principal',
                           )}
                        >
                           <span
                              aria-hidden
                              className="text-coral-principal"
                           >
                              {'★'.repeat(fullStars)}
                           </span>
                           <span
                              aria-hidden
                              className="text-beige-3"
                           >
                              {'★'.repeat(5 - fullStars)}
                           </span>
                           {/* toLocaleString('es-ES'): "4,5" con coma decimal */}
                           &nbsp; {rating.toLocaleString('es-ES')} o más
                        </Link>
                     </li>
                  )
               })}
            </ul>
         </FilterGroup>

         <FilterGroup title="OFERTAS">
            <Link
               href={withFilter(filters, {
                  rebajas: filters.rebajas ? undefined : true,
               })}
               aria-current={filters.rebajas ? 'true' : undefined}
               className="flex items-center gap-[9px] text-sm text-brown-2 hover:text-brown-principal"
            >
               <span
                  className={cn(
                     'flex size-4 items-center justify-center rounded border text-[11px] text-white',
                     filters.rebajas
                        ? 'border-coral-principal bg-coral-principal'
                        : 'border-beige-3',
                  )}
               >
                  {filters.rebajas && '✓'}
               </span>
               Solo rebajas
            </Link>
         </FilterGroup>
      </div>
   )
}

interface FilterGroupProps {
   title: string
   children: React.ReactNode
}

// Bloque con título de cada filtro. Extraído porque se repite 5 veces
function FilterGroup({ title, children }: FilterGroupProps) {
   return (
      <div>
         <h3 className="mb-3 text-xs tracking-[0.1em] text-brown-1">{title}</h3>
         {children}
      </div>
   )
}

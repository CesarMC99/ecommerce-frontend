import { Pagination } from '@/components/shared/Pagination'
import { catalogRoute, type CatalogFilters } from '@/lib/routes'

interface CatalogPaginationProps {
   filters: CatalogFilters
   page: number
   totalPages: number
}

// Paginación del catálogo: la genérica, conservando los filtros en la URL
export function CatalogPagination({
   filters,
   page,
   totalPages,
}: CatalogPaginationProps) {
   return (
      <Pagination
         page={page}
         totalPages={totalPages}
         pageHref={(target) => catalogRoute({ ...filters, pagina: target })}
      />
   )
}

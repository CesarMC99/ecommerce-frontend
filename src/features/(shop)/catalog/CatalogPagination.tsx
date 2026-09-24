import { catalogRoute, type CatalogFilters } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CatalogPaginationProps {
   filters: CatalogFilters
   page: number
   totalPages: number
}

const pageClass =
   'flex size-[38px] items-center justify-center rounded-md text-[13px]'

// Paginación con ENLACES: cada página tiene su propia URL (?pagina=2), así
// se puede compartir, usar "atrás" del navegador y Google indexa todo
export function CatalogPagination({
   filters,
   page,
   totalPages,
}: CatalogPaginationProps) {
   // Con una sola página no hay nada que paginar
   if (totalPages <= 1) return null

   const pageHref = (target: number) => catalogRoute({ ...filters, pagina: target })
   const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

   return (
      <nav
         aria-label="Paginación"
         className="mt-12 flex justify-center gap-2"
      >
         <PageArrow
            href={page > 1 ? pageHref(page - 1) : null}
            label="Página anterior"
            symbol="‹"
         />

         {pages.map((target) =>
            target === page ? (
               // La página actual no es un enlace (no lleva a ningún sitio nuevo)
               <span
                  key={target}
                  aria-current="page"
                  className={cn(pageClass, 'bg-brown-principal text-neutro-2')}
               >
                  {target}
               </span>
            ) : (
               <Link
                  key={target}
                  href={pageHref(target)}
                  aria-label={`Página ${target}`}
                  className={cn(
                     pageClass,
                     'border border-beige-2 bg-neutro-1 text-brown-2 hover:border-brown-principal',
                  )}
               >
                  {target}
               </Link>
            ),
         )}

         <PageArrow
            href={page < totalPages ? pageHref(page + 1) : null}
            label="Página siguiente"
            symbol="›"
         />
      </nav>
   )
}

interface PageArrowProps {
   /** null → flecha deshabilitada (primera o última página) */
   href: string | null
   label: string
   symbol: string
}

function PageArrow({ href, label, symbol }: PageArrowProps) {
   const className = cn(pageClass, 'border border-beige-2 bg-neutro-1')

   if (!href) {
      return (
         <span
            aria-hidden
            className={cn(className, 'text-beige-3')}
         >
            {symbol}
         </span>
      )
   }
   return (
      <Link
         href={href}
         aria-label={label}
         className={cn(className, 'text-brown-principal hover:border-brown-principal')}
      >
         {symbol}
      </Link>
   )
}

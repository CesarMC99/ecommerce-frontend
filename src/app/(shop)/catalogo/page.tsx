import { Container } from '@/components/shared/Container'
import { ProductCard } from '@/components/shared/ProductCard'
import { parseCatalogFilters } from '@/features/(shop)/catalog/catalog-params'
import { CatalogEmpty } from '@/features/(shop)/catalog/CatalogEmpty'
import { CatalogFilters } from '@/features/(shop)/catalog/CatalogFilters'
import { CatalogPagination } from '@/features/(shop)/catalog/CatalogPagination'
import { getCatalogTitle } from '@/features/(shop)/catalog/catalog-title'
import { getCatalog } from '@/features/(shop)/catalog/get-catalog'
import { SortSelect } from '@/features/(shop)/catalog/SortSelect'
import { catalogRoute, ROUTES } from '@/lib/routes'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// En Next 16 los searchParams llegan como PROMESA: hay que esperarlos
type CatalogPageProps = {
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Título de la pestaña según el filtro: "Mujer · ÁMBAR", "Rebajas · ÁMBAR"...
// Ayuda al usuario (varias pestañas abiertas) y a los buscadores
export async function generateMetadata({
   searchParams,
}: CatalogPageProps): Promise<Metadata> {
   const filters = parseCatalogFilters(await searchParams)
   return { title: `${getCatalogTitle(filters)} · ÁMBAR` }
}

// La página solo ORQUESTA: lee la URL, pide los datos y reparte cada cosa
// a su componente. Los filtros viven en la URL, así que esta página es un
// Server Component puro: cada cambio de filtro es una navegación normal
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
   const filters = parseCatalogFilters(await searchParams)
   const { products, productFacets } = await getCatalog(filters)

   // ?pagina=7 cuando solo hay 2 páginas (p. ej. un enlace viejo o escrito
   // a mano): en vez de mostrar "sin resultados", se lleva a la última
   if (products.totalPages > 0 && products.page > products.totalPages) {
      redirect(catalogRoute({ ...filters, pagina: products.totalPages }))
   }

   const title = getCatalogTitle(filters)
   const filtersPanel = (
      <CatalogFilters
         filters={filters}
         facets={productFacets}
      />
   )

   return (
      <>
         <Container className="pt-8">
            <nav
               aria-label="Ruta de navegación"
               className="text-xs tracking-[0.04em] text-brown-1"
            >
               <Link
                  href={ROUTES.home}
                  className="hover:text-brown-principal"
               >
                  Inicio
               </Link>
               <span aria-hidden> / </span>
               {title === 'Catálogo' ? (
                  <span className="text-brown-principal">Catálogo</span>
               ) : (
                  <>
                     <Link
                        href={ROUTES.catalog}
                        className="hover:text-brown-principal"
                     >
                        Catálogo
                     </Link>
                     <span aria-hidden> / </span>
                     <span className="text-brown-principal">{title}</span>
                  </>
               )}
            </nav>
            <h1 className="mt-3.5 font-bricolage-bold text-[40px] tracking-[-0.02em] text-brown-principal">
               {title}
            </h1>
            <p className="mt-1.5 text-sm text-brown-1">
               {products.totalCount}{' '}
               {products.totalCount === 1 ? 'artículo' : 'artículos'} · prendas y
               accesorios en tonos tierra
            </p>
         </Container>

         <Container className="grid items-start gap-10 pt-7 pb-[72px] md:grid-cols-[236px_1fr]">
            {/* Móvil: los filtros van plegados en un <details> nativo
                (abre/cierra sin JavaScript). Escritorio: barra lateral fija */}
            <details className="rounded-md border border-beige-2 bg-neutro-1 p-4 md:hidden">
               <summary className="cursor-pointer font-bricolage-semibold text-brown-principal">
                  Filtros
               </summary>
               <div className="mt-4">{filtersPanel}</div>
            </details>
            <aside
               aria-label="Filtros"
               // top-[90px]: por debajo del header, que también es sticky
               className="sticky top-[90px] hidden md:block"
            >
               {filtersPanel}
            </aside>

            <section aria-label="Productos">
               <div className="mb-[22px] flex flex-wrap items-center justify-between gap-3">
                  {/* aria-live: al filtrar, el lector de pantalla anuncia el
                      nuevo número de resultados sin que el usuario lo busque */}
                  <p
                     aria-live="polite"
                     className="text-[13px] text-brown-1"
                  >
                     {products.totalCount}{' '}
                     {products.totalCount === 1 ? 'resultado' : 'resultados'}
                  </p>
                  <SortSelect filters={filters} />
               </div>

               {products.items.length === 0 ? (
                  <CatalogEmpty filters={filters} />
               ) : (
                  <div className="grid grid-cols-2 gap-[22px] lg:grid-cols-3">
                     {products.items.map((product) => (
                        <ProductCard
                           key={product.id}
                           product={product}
                           showRating
                           // 3 columnas del área de productos (~310 px) en
                           // escritorio, 2 en tablet y móvil
                           imageSizes="(min-width: 1280px) 320px, (min-width: 1024px) 30vw, 50vw"
                        />
                     ))}
                  </div>
               )}

               <CatalogPagination
                  filters={filters}
                  page={products.page}
                  totalPages={products.totalPages}
               />
            </section>
         </Container>
      </>
   )
}

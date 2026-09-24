import { Container } from '@/components/shared/Container'
import { ProductSection } from '@/components/shared/ProductSection'
import { getProduct } from '@/features/(shop)/product/get-product'
import { ProductGallery } from '@/features/(shop)/product/ProductGallery'
import { ProductPurchasePanel } from '@/features/(shop)/product/ProductPurchasePanel'
import { ProductReviewsSummary } from '@/features/(shop)/product/ProductReviewsSummary'
import { API_TO_CATEGORY, CATEGORY_LABELS } from '@/lib/categories'
import { formatPrice } from '@/lib/format-price'
import { catalogRoute, ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Next 16: los params de una ruta dinámica ([slug]) llegan como PROMESA
type ProductPageProps = {
   params: Promise<{ slug: string }>
}

// <title> y vista previa al compartir el enlace (WhatsApp, redes...).
// getProduct usa `cache`: esta llamada y la de la página hacen UNA sola
// petición al backend
export async function generateMetadata({
   params,
}: ProductPageProps): Promise<Metadata> {
   const { slug } = await params
   const { product } = await getProduct(slug)
   if (!product) return { title: 'Producto no encontrado · ÁMBAR' }

   return {
      title: `${product.name} · ÁMBAR`,
      description: product.description,
   }
}

export default async function ProductPage({ params }: ProductPageProps) {
   const { slug } = await params
   const { product, relatedProducts } = await getProduct(slug)

   // No existe o es un borrador → muestra not-found.tsx con estado 404
   // (importante para buscadores: la URL no es una página válida)
   if (!product) notFound()

   const category = API_TO_CATEGORY[product.category]
   const categoryLabel = CATEGORY_LABELS[category]
   const tag = product.discountPercentage
      ? `-${product.discountPercentage}%`
      : product.isNew
        ? 'Nuevo'
        : null

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
               <Link
                  href={catalogRoute({ categoria: category })}
                  className="hover:text-brown-principal"
               >
                  {categoryLabel}
               </Link>
               <span aria-hidden> / </span>
               <span
                  aria-current="page"
                  className="text-brown-principal"
               >
                  {product.name}
               </span>
            </nav>
         </Container>

         <Container className="grid items-start gap-10 pt-6 pb-16 md:grid-cols-[1.1fr_1fr] md:gap-14">
            {/* En escritorio la galería se queda fija mientras la columna
                de información (más larga) hace scroll */}
            <div className="md:sticky md:top-[90px]">
               <ProductGallery
                  images={product.images}
                  productName={product.name}
               />
            </div>

            <div>
               <p className="text-xs tracking-[0.16em] text-brown-1">
                  {categoryLabel.toUpperCase()} · {product.type.toUpperCase()}
               </p>
               <h1 className="mt-2 font-bricolage-bold text-[34px] leading-tight tracking-[-0.02em] text-brown-principal md:text-[40px]">
                  {product.name}
               </h1>

               <p className="mt-3 flex items-center gap-2.5 text-[13px]">
                  <span className="text-sm text-coral-principal">
                     ★ {product.rating.toLocaleString('es-ES')}
                  </span>
                  <a
                     href="#reviews-title"
                     className="text-brown-1 hover:text-brown-principal"
                  >
                     · {product.reviewsCount} opiniones
                  </a>
               </p>

               <div className="mt-5 flex flex-wrap items-baseline gap-3">
                  <span className="text-[30px] font-helvetica-bold text-brown-principal">
                     {formatPrice(product.price)}
                  </span>
                  {product.discountPercentage !== null &&
                     product.compareAtPrice !== null && (
                        <span className="text-base text-brown-1 line-through">
                           {formatPrice(product.compareAtPrice)}
                        </span>
                     )}
                  {tag && (
                     <span className="bg-coral-principal px-2.5 py-1 text-[11px] font-helvetica-bold text-white">
                        {tag}
                     </span>
                  )}
               </div>

               <p
                  className={cn(
                     'mt-2.5 flex items-center gap-1.5 text-[13px]',
                     product.inStock ? 'text-success' : 'text-destructive',
                  )}
               >
                  <span
                     aria-hidden
                     className={cn(
                        'inline-block size-[7px] rounded-full',
                        product.inStock ? 'bg-success' : 'bg-destructive',
                     )}
                  />
                  {product.inStock ? 'En stock' : 'Agotado'}
               </p>

               <div className="mt-7">
                  <p className="mb-3 text-xs tracking-[0.1em] text-brown-1">
                     COLOR · {product.color.name.toUpperCase()}
                  </p>
                  <span
                     aria-hidden
                     title={product.color.name}
                     className="block size-8 rounded-full shadow-[0_0_0_2px_var(--color-neutro-2),0_0_0_4px_var(--color-brown-principal)]"
                     style={{ backgroundColor: product.color.hex }}
                  />
               </div>

               <ProductPurchasePanel
                  sizes={product.sizes}
                  inStock={product.inStock}
               />

               <div className="mt-8 border-t border-beige-2 pt-6">
                  <h2 className="mb-2.5 text-[13px] font-helvetica-bold text-brown-principal">
                     Descripción
                  </h2>
                  <p className="text-sm leading-relaxed text-brown-1">
                     {product.description}
                  </p>
                  {product.details.length > 0 && (
                     <ul className="mt-4 flex flex-col gap-1.5 text-[13px] text-brown-1">
                        {product.details.map((detail) => (
                           <li key={detail}>· {detail}</li>
                        ))}
                     </ul>
                  )}
               </div>
            </div>
         </Container>

         <ProductReviewsSummary
            rating={product.rating}
            reviewsCount={product.reviewsCount}
         />

         <div className="pb-10">
            <ProductSection
               title="También te puede gustar"
               products={relatedProducts}
               seeAllHref={catalogRoute({ categoria: category })}
            />
         </div>
      </>
   )
}

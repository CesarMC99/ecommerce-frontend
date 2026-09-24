import { Container } from '@/components/shared/Container'
import { ProductCard } from '@/components/shared/ProductCard'
import type { ProductCardFieldsFragment } from '@/graphql/generated/graphql'
import Link from 'next/link'

interface ProductSectionProps {
   title: string
   products: ProductCardFieldsFragment[]
   seeAllHref: string
}

// "Destacados" y "Novedades" son la MISMA sección con distintos datos.
// Un componente parametrizado evita mantener dos copias que acabarían
// divergiendo (arreglas un margen en una y te olvidas de la otra)
export const ProductSection = ({
   title,
   products,
   seeAllHref,
}: ProductSectionProps) => {
   // Sin productos (backend caído o catálogo vacío) la sección no se pinta:
   // mejor que un título "Destacados" encima de un hueco en blanco
   if (products.length === 0) return null

   return (
      <section className="animate-fade-up pt-[72px] pb-[30px]">
         <Container>
            <div className="mb-[30px] flex items-baseline justify-between">
               <h2 className="font-bricolage-semibold text-[32px] tracking-[-0.02em] text-brown-principal">
                  {title}
               </h2>
               <Link
                  href={seeAllHref}
                  className="text-[13px] tracking-[0.04em] text-coral-principal hover:underline"
               >
                  Ver todo →
               </Link>
            </div>

            <div className="grid grid-cols-2 gap-[22px] md:grid-cols-4">
               {products.map((product) => (
                  <ProductCard
                     key={product.id}
                     product={product}
                  />
               ))}
            </div>
         </Container>
      </section>
   )
}

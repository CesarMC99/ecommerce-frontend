import { BenefitsBar } from '@/features/(shop)/home/BenefitsBar'
import { CategoryGrid } from '@/features/(shop)/home/CategoryGrid'
import { HomeHero } from '@/features/(shop)/home/HomeHero'
import { Newsletter } from '@/features/(shop)/home/Newsletter'
import { OffersBanner } from '@/features/(shop)/home/OffersBanner'
import { ProductSection } from '@/features/(shop)/home/ProductSection'
import { Testimonials } from '@/features/(shop)/home/Testimonials'
import { getProductsByIds } from '@/lib/mock/products'
import { catalogRoute } from '@/lib/routes'

// La página solo COMPONE secciones y decide qué datos recibe cada una.
// El detalle visual vive en src/features/(shop)/home/, así esta página se
// lee de un vistazo como el índice de la home
export default function HomePage() {
   // TODO(backend): sustituir por queries GraphQL (destacados / novedades)
   const featured = getProductsByIds([1, 4, 6, 8])
   const newArrivals = getProductsByIds([11, 12, 9, 10])

   return (
      <>
         <HomeHero />
         <BenefitsBar />
         <ProductSection
            title="Destacados"
            products={featured}
            seeAllHref={catalogRoute()}
         />
         <CategoryGrid />
         <OffersBanner />
         <ProductSection
            title="Novedades"
            products={newArrivals}
            seeAllHref={catalogRoute({ orden: 'novedades' })}
         />
         <Testimonials />
         <Newsletter />
      </>
   )
}

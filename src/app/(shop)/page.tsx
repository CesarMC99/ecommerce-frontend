import { BenefitsBar } from '@/features/(shop)/home/BenefitsBar'
import { CategoryGrid } from '@/features/(shop)/home/CategoryGrid'
import { getHomeProducts } from '@/features/(shop)/home/get-home-products'
import { HomeHero } from '@/features/(shop)/home/HomeHero'
import { Newsletter } from '@/features/(shop)/home/Newsletter'
import { OffersBanner } from '@/features/(shop)/home/OffersBanner'
import { ProductSection } from '@/components/shared/ProductSection'
import { Testimonials } from '@/features/(shop)/home/Testimonials'
import { catalogRoute } from '@/lib/routes'

// ISR: la home se genera como página estática (rapidísima) y se regenera
// en segundo plano como mucho cada 60 s. Sin esto se generaría UNA vez al
// desplegar: si ese momento el backend estaba dormido (plan gratis de
// Render), la home se quedaría sin productos hasta el siguiente despliegue
export const revalidate = 60

// La página solo COMPONE secciones y decide qué datos recibe cada una.
// El detalle visual vive en src/features/(shop)/home/, así esta página se
// lee de un vistazo como el índice de la home.
// Es `async` porque es un Server Component que espera los datos del backend
export default async function HomePage() {
   const { featured, newArrivals } = await getHomeProducts()

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

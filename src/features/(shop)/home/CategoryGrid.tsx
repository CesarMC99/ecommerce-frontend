import { Container } from '@/components/shared/Container'
import { ImagePlaceholder } from '@/components/shared/ImagePlaceholder'
import { catalogRoute, type CatalogCategory } from '@/lib/routes'
import Link from 'next/link'

const CATEGORIES: { label: string; slug: CatalogCategory }[] = [
   { label: 'Mujer', slug: 'mujer' },
   { label: 'Hombre', slug: 'hombre' },
   { label: 'Accesorios', slug: 'accesorios' },
]

export const CategoryGrid = () => {
   return (
      <section className="py-[42px]">
         <Container className="grid gap-[18px] md:grid-cols-3">
            {CATEGORIES.map((category) => (
               <Link
                  key={category.slug}
                  href={catalogRoute({ categoria: category.slug })}
                  className="transition-transform duration-300 hover:scale-[0.99]"
               >
                  <ImagePlaceholder className="aspect-4/5 p-[26px]">
                     <span className="font-bricolage-bold text-[26px] tracking-[-0.01em] text-brown-principal">
                        {category.label} →
                     </span>
                  </ImagePlaceholder>
               </Link>
            ))}
         </Container>
      </section>
   )
}

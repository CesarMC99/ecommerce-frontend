import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Container } from '@/components/shared/Container'
import { catalogRoute, type CatalogCategory } from '@/lib/routes'
import { CATEGORY_IMAGES } from '@/lib/site-images'
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
                  // `group`: la foto hace un zoom suave al pasar el ratón
                  className="group relative block overflow-hidden rounded"
               >
                  <CloudinaryImage
                     image={CATEGORY_IMAGES[category.slug]}
                     className="aspect-4/5 transition-transform duration-500 group-hover:scale-[1.03]"
                     autoCrop="4:5"
                     // Un tercio de pantalla en escritorio (máx. ~400 px)
                     sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
                  />

                  {/* Degradado oscuro abajo: garantiza que el texto blanco se
                      lea sobre CUALQUIER foto, sea clara u oscura. Sin él, sobre
                      la chaqueta blanca de "Mujer" el texto desaparecería */}
                  <div
                     aria-hidden
                     className="absolute inset-0 bg-linear-to-t from-brown-principal/70 via-brown-principal/10 to-transparent"
                  />

                  <span className="absolute bottom-[26px] left-[26px] font-bricolage-bold text-[26px] tracking-[-0.01em] text-neutro-3">
                     {category.label} →
                  </span>
               </Link>
            ))}
         </Container>
      </section>
   )
}

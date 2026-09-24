import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { Container } from '@/components/shared/Container'
import { catalogRoute } from '@/lib/routes'
import { PROMO_IMAGE } from '@/lib/site-images'
import Link from 'next/link'

export const OffersBanner = () => {
   return (
      <Container className="mt-[42px]">
         <section className="grid overflow-hidden rounded bg-coral-principal md:grid-cols-[1.2fr_1fr]">
            <div className="px-8 py-12 text-neutro-3 md:px-12 md:py-14">
               <p className="text-xs tracking-[0.24em] opacity-85">
                  EDICIÓN REBAJAS
               </p>
               <h2 className="mt-3 font-bricolage-extrabold text-[34px] leading-none tracking-[-0.02em] md:text-[46px]">
                  Hasta -50% en prendas de temporada
               </h2>
               <Link
                  href={catalogRoute({ rebajas: true })}
                  className="mt-7 inline-block bg-neutro-3 px-7 py-3.5 text-[13px] font-helvetica-bold tracking-[0.04em] text-brown-principal transition-transform hover:-translate-y-px"
               >
                  Comprar rebajas
               </Link>
            </div>

            {/* La foto ocupa TODA la altura de la columna de texto (h-full).
                En móvil se oculta: el banner apilado quedaría demasiado alto.
                Como está oculta con display:none y la carga es diferida
                (lazy), en móvil el navegador ni siquiera la descarga */}
            <CloudinaryImage
               image={PROMO_IMAGE}
               className="hidden h-full rounded-none md:block"
               // La foto original es vertical y el hueco horizontal: el
               // recorte automático conserva a la persona en vez del centro
               autoCrop="16:10"
               sizes="(min-width: 1280px) 545px, 45vw"
            />
         </section>
      </Container>
   )
}

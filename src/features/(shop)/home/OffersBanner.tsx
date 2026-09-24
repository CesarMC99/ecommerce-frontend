import { Container } from '@/components/shared/Container'
import { catalogRoute } from '@/lib/routes'
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

            {/* Franjas blancas translúcidas sobre el coral: aquí no sirve el
                ImagePlaceholder porque sus colores son para fondo claro */}
            <div className="hidden items-end bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.14)_0_14px,transparent_14px_28px)] p-5 font-mono text-[11px] tracking-[0.08em] text-white/70 md:flex">
               FOTO PROMO
            </div>
         </section>
      </Container>
   )
}

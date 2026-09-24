import { Container } from '@/components/shared/Container'
import { CloudinaryImage } from '@/components/shared/CloudinaryImage'
import { catalogRoute } from '@/lib/routes'
import { HERO_IMAGE } from '@/lib/site-images'
import Link from 'next/link'

export const HomeHero = () => {
   return (
      <Container className="grid items-stretch md:grid-cols-2">
         <div className="flex animate-fade-up flex-col justify-center py-16 md:py-24 md:pr-14">
            <p className="mb-[22px] text-xs tracking-[0.22em] text-brown-1">
               COLECCIÓN OTOÑO · 2026
            </p>

            {/* Único <h1> de la página: le dice a buscadores y lectores de
                pantalla de qué trata la home */}
            <h1 className="font-bricolage-bold text-[44px] leading-none tracking-[-0.025em] text-brown-principal md:text-[62px]">
               El guardarropa esencial, reinventado.
            </h1>

            <p className="mt-6 max-w-[400px] text-base leading-relaxed text-brown-1">
               Tejidos naturales, cortes atemporales y una paleta cálida pensada
               para durar más de una temporada.
            </p>

            {/* Son <Link> y no <button>: su función es NAVEGAR. Un botón con
                router.push funcionaría, pero rompe "abrir en pestaña nueva" */}
            <div className="mt-9 flex flex-wrap gap-3.5">
               <Link
                  href={catalogRoute({ categoria: 'mujer' })}
                  className="bg-coral-principal px-[30px] py-[15px] text-[13px] font-helvetica-medium tracking-[0.04em] text-white transition hover:-translate-y-px hover:bg-coral-4"
               >
                  Comprar mujer
               </Link>
               <Link
                  href={catalogRoute({ categoria: 'hombre' })}
                  className="border border-brown-principal px-[30px] py-[15px] text-[13px] font-helvetica-medium tracking-[0.04em] text-brown-principal transition-colors hover:bg-brown-principal hover:text-neutro-2"
               >
                  Comprar hombre
               </Link>
            </div>
         </div>

         <CloudinaryImage
            image={HERO_IMAGE}
            className="aspect-[1/1.05] animate-fade-in rounded-none"
            // Misma proporción que el hueco (1 : 1,05 = 20 : 21)
            autoCrop="20:21"
            // Media pantalla en escritorio (máx. 640 px), pantalla completa en móvil
            sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
            // Es lo PRIMERO que se ve al entrar: se descarga con prioridad.
            // Con carga diferida aparecería tarde y empeoraría el LCP (la
            // métrica de Google de 'cuánto tarda en verse lo principal')
            priority
         />
      </Container>
   )
}

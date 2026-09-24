import { Container } from '@/components/shared/Container'
import { Fragment } from 'react'

const BENEFITS = [
   'ENVÍO GRATIS +50€',
   'DEVOLUCIONES 30 DÍAS',
   'PAGO SEGURO',
   'ATENCIÓN 24/7',
]

export const BenefitsBar = () => {
   return (
      <div className="bg-brown-principal text-neutro-3">
         <Container className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-12 py-[18px] text-xs tracking-[0.08em]">
            {BENEFITS.map((benefit, index) => (
               // Fragment con key: agrupa texto + separador sin añadir un
               // <div> extra que rompería el flex
               <Fragment key={benefit}>
                  {/* El "·" va ANTES de cada item salvo el primero: así nunca
                      queda un separador colgando al final. En móvil se oculta
                      porque los textos saltan de línea y el "·" quedaría suelto */}
                  {index > 0 && (
                     <span
                        aria-hidden
                        className="hidden opacity-40 md:inline"
                     >
                        ·
                     </span>
                  )}
                  <span>{benefit}</span>
               </Fragment>
            ))}
         </Container>
      </div>
   )
}

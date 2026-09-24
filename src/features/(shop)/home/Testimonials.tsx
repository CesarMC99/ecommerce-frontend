import { Container } from '@/components/shared/Container'

// Contenido estático de marketing: no depende del backend, así que vive
// junto al único componente que lo usa
const TESTIMONIALS = [
   {
      quote: 'La calidad de los tejidos es excepcional. El abrigo de lana se ha convertido en mi prenda favorita del invierno.',
      author: 'Laura M.',
   },
   {
      quote: 'Pedido el lunes, recibido el miércoles. Embalaje precioso y todo impecable. Repetiré sin duda.',
      author: 'Carlos R.',
   },
   {
      quote: 'Por fin una tienda con cortes atemporales y colores que combinan entre sí. Justo lo que buscaba.',
      author: 'Marta S.',
   },
]

export const Testimonials = () => {
   return (
      <section className="mt-12 bg-beige-1">
         <Container className="py-[72px]">
            <h2 className="mb-11 text-center font-bricolage-semibold text-[32px] tracking-[-0.02em] text-brown-principal">
               Lo que dicen de nosotros
            </h2>

            <div className="grid gap-[22px] md:grid-cols-3">
               {TESTIMONIALS.map((testimonial) => (
                  // <figure> + <blockquote> + <figcaption> es la forma
                  // semántica de marcar una cita con su autor
                  <figure
                     key={testimonial.author}
                     className="rounded bg-neutro-2 p-[30px]"
                  >
                     <p
                        aria-label="5 de 5 estrellas"
                        className="text-[15px] tracking-widest text-coral-principal"
                     >
                        ★★★★★
                     </p>
                     <blockquote className="mt-4 text-[15px] leading-relaxed text-brown-2">
                        {testimonial.quote}
                     </blockquote>
                     <figcaption className="mt-[18px] text-[13px] font-helvetica-medium text-brown-1">
                        {testimonial.author}
                     </figcaption>
                  </figure>
               ))}
            </div>
         </Container>
      </section>
   )
}

import { Container } from '@/components/shared/Container'

interface ProductReviewsSummaryProps {
   rating: number
   reviewsCount: number
}

// Resumen de valoraciones. La LISTA de opiniones del diseño necesita un
// módulo de reseñas en el backend (quién opina, cuándo, qué texto); de
// momento se muestra el resumen con los datos que ya existen
export function ProductReviewsSummary({
   rating,
   reviewsCount,
}: ProductReviewsSummaryProps) {
   // Estrellas llenas redondeando a la media estrella más cercana hacia abajo
   const fullStars = Math.floor(rating)

   return (
      <section
         aria-labelledby="reviews-title"
         className="bg-beige-1"
      >
         <Container className="py-14">
            <h2
               id="reviews-title"
               className="font-bricolage-semibold text-[26px] text-brown-principal"
            >
               Opiniones
            </h2>
            <div className="mt-3.5 flex items-baseline gap-2">
               <span className="font-bricolage-bold text-5xl text-brown-principal">
                  {rating.toLocaleString('es-ES')}
               </span>
               <span
                  aria-label={`${rating.toLocaleString('es-ES')} de 5 estrellas`}
                  className="text-base tracking-widest"
               >
                  <span className="text-coral-principal">
                     {'★'.repeat(fullStars)}
                  </span>
                  <span className="text-beige-3">
                     {'★'.repeat(5 - fullStars)}
                  </span>
               </span>
            </div>
            <p className="mt-1.5 text-[13px] text-brown-1">
               {reviewsCount} opiniones verificadas
            </p>
         </Container>
      </section>
   )
}

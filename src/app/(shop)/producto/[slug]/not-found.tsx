import { Container } from '@/components/shared/Container'
import { ROUTES } from '@/lib/routes'
import Link from 'next/link'

// Se muestra cuando la página llama a notFound(): el slug no existe o el
// producto aún no está publicado. Next responde con estado 404, que le
// dice a los buscadores que esa URL no es una página válida
export default function ProductNotFound() {
   return (
      <Container className="py-[100px] text-center">
         <p className="font-bricolage-bold text-[32px] text-brown-principal">
            Producto no encontrado
         </p>
         <p className="mt-2 text-sm text-brown-1">
            Puede que ya no esté disponible o que el enlace no sea correcto.
         </p>
         <Link
            href={ROUTES.catalog}
            className="mt-7 inline-block bg-coral-principal px-7 py-3.5 text-[13px] font-helvetica-medium text-white transition-colors hover:bg-coral-4"
         >
            Ver el catálogo
         </Link>
      </Container>
   )
}

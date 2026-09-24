'use client' // Los error boundaries de Next SIEMPRE son Client Components

import { Container } from '@/components/shared/Container'
import { useEffect } from 'react'

// Se muestra si getCatalog() falla (backend caído, error de red...).
// El header y el footer siguen visibles: solo se sustituye el contenido
// de esta página, no la tienda entera
export default function CatalogError({
   error,
   unstable_retry,
}: {
   error: Error & { digest?: string }
   // Next 16: vuelve a pedir los datos y a renderizar la página
   unstable_retry: () => void
}) {
   useEffect(() => {
      // Aquí se enviaría el error a un servicio de monitorización (Sentry...)
      console.error('[catálogo]', error)
   }, [error])

   return (
      <Container className="py-[90px] text-center">
         <p className="font-bricolage-semibold text-xl text-brown-principal">
            No pudimos cargar el catálogo
         </p>
         {/* No se muestra error.message: puede contener detalles internos
             del servidor que no deben llegar al usuario */}
         <p className="mt-2 text-sm text-brown-1">
            Puede ser un problema momentáneo de conexión.
         </p>
         <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-6 cursor-pointer bg-brown-principal px-6 py-3 text-[13px] text-neutro-2 transition-colors hover:bg-brown-2"
         >
            Reintentar
         </button>
      </Container>
   )
}

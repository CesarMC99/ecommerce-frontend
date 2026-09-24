import { Container } from '@/components/shared/Container'

// Next muestra esto AUTOMÁTICAMENTE mientras la página del catálogo espera
// al backend (al llegar desde otra página). Es un "esqueleto": la misma
// forma que tendrá la página, así el contenido real no "salta" al llegar
export default function CatalogLoading() {
   return (
      <Container
         className="animate-pulse pt-8 pb-[72px]"
         // El lector de pantalla anuncia que se está cargando
         role="status"
         aria-label="Cargando catálogo"
      >
         <div className="h-3 w-32 rounded bg-beige-1" />
         <div className="mt-4 h-10 w-56 rounded bg-beige-1" />
         <div className="mt-8 grid gap-10 md:grid-cols-[236px_1fr]">
            <div className="hidden h-96 rounded bg-beige-1 md:block" />
            <div className="grid grid-cols-2 gap-[22px] lg:grid-cols-3">
               {Array.from({ length: 6 }, (_, index) => (
                  <div key={index}>
                     <div className="aspect-3/4 rounded bg-beige-1" />
                     <div className="mt-3 h-3.5 w-2/3 rounded bg-beige-1" />
                     <div className="mt-2 h-3.5 w-1/4 rounded bg-beige-1" />
                  </div>
               ))}
            </div>
         </div>
      </Container>
   )
}

'use client'
// Client Component: depende de la sesión (estado del navegador)

import { Container } from '@/components/shared/Container'
import { ProductCard } from '@/components/shared/ProductCard'
import { SpriteIcon } from '@/components/shared/SpriteIcon'
import { PRODUCTS_BY_IDS } from '@/graphql/modules/favorites/queries/favorites.queries'
import { useFavorites } from '@/hooks/use-favorites'
import { loginRoute, registerRoute, ROUTES } from '@/lib/routes'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'

export function FavoritesPageContent() {
   const { favoriteIds, status, isLoading: idsLoading } = useFavorites()
   const isAuthenticated = status === 'authenticated'

   // De ids a tarjetas (productsByIds descarta los que ya no están a la venta)
   const { data, previousData, error } = useQuery(PRODUCTS_BY_IDS, {
      variables: { ids: favoriteIds },
      skip: !isAuthenticated || favoriteIds.length === 0,
   })

   // previousData: al quitar un corazón, la lista anterior se mantiene
   // mientras llega la nueva (sin parpadeo a "cargando")
   const products = (data ?? previousData)?.productsByIds ?? []
   // Al desmarcar un corazón, la tarjeta desaparece al instante (sin
   // esperar al servidor) filtrando por los ids actuales
   const visibleProducts = products.filter((product) =>
      favoriteIds.includes(product.id),
   )
   const isLoading =
      status === 'loading' ||
      idsLoading ||
      (favoriteIds.length > 0 && !data && !previousData && !error)

   return (
      <Container className="pt-8 pb-[72px]">
         <nav
            aria-label="Ruta de navegación"
            className="mb-3.5 text-xs tracking-[0.04em] text-brown-1"
         >
            <Link
               href={ROUTES.home}
               className="hover:text-brown-principal"
            >
               Inicio
            </Link>
            <span aria-hidden> / </span>
            <span
               aria-current="page"
               className="text-brown-principal"
            >
               Favoritos
            </span>
         </nav>
         <h1 className="mb-2 font-bricolage-bold text-[40px] tracking-[-0.02em] text-brown-principal">
            Favoritos
         </h1>
         <p className="mb-8 text-sm text-brown-1">
            Tus prendas guardadas para más tarde
         </p>

         {isLoading ? (
            <div
               role="status"
               aria-label="Cargando favoritos"
               className="flex justify-center py-24"
            >
               <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
            </div>
         ) : !isAuthenticated ? (
            // Invitado: los favoritos exigen sesión. Tras entrar vuelve aquí
            <div className="rounded-md bg-neutro-1 px-5 py-[80px] text-center">
               <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-beige-1">
                  <SpriteIcon
                     name="heart"
                     className="size-6 text-coral-principal"
                  />
               </div>
               <p className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
                  Inicia sesión para ver tus favoritos
               </p>
               <p className="mx-auto mb-6 max-w-sm text-sm text-brown-1">
                  Guarda las prendas que te gusten y encuéntralas en cualquier
                  dispositivo.
               </p>
               <div className="flex flex-wrap justify-center gap-3">
                  <Link
                     href={loginRoute(ROUTES.favorites)}
                     className="bg-coral-principal px-7 py-3.5 text-[13px] font-helvetica-medium text-white hover:bg-coral-4"
                  >
                     Iniciar sesión
                  </Link>
                  <Link
                     href={registerRoute(ROUTES.favorites)}
                     className="border border-brown-principal px-7 py-3.5 text-[13px] font-helvetica-medium text-brown-principal hover:bg-brown-principal hover:text-neutro-2"
                  >
                     Crear cuenta
                  </Link>
               </div>
            </div>
         ) : error ? (
            <p
               role="alert"
               className="rounded-md border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive"
            >
               No pudimos cargar tus favoritos. Revisa tu conexión y recarga la
               página.
            </p>
         ) : visibleProducts.length === 0 ? (
            <div className="rounded-md bg-neutro-1 px-5 py-[90px] text-center">
               <p
                  aria-hidden
                  className="mb-4 text-[42px] text-coral-principal"
               >
                  ♡
               </p>
               <p className="mb-2 font-bricolage-semibold text-2xl text-brown-principal">
                  Aún no tienes favoritos
               </p>
               <p className="mb-6 text-sm text-brown-1">
                  Pulsa el corazón en cualquier producto para guardarlo aquí.
               </p>
               <Link
                  href={ROUTES.catalog}
                  className="inline-block bg-brown-principal px-[30px] py-3.5 text-[13px] text-neutro-2 hover:bg-brown-2"
               >
                  Explorar tienda
               </Link>
            </div>
         ) : (
            <div className="grid grid-cols-2 gap-[22px] md:grid-cols-4">
               {visibleProducts.map((product) => (
                  <ProductCard
                     key={product.id}
                     product={product}
                  />
               ))}
            </div>
         )}
      </Container>
   )
}

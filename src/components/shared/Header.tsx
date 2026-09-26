import { catalogRoute, ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { AccountMenu } from './AccountMenu'
import { CartButton } from './cart/CartButton'
import { Container } from './Container'
import { FavoritesLink } from './favorites/FavoritesLink'
import { SpriteIcon } from './SpriteIcon'

// Los menús se describen como DATOS y se pintan con un .map(): añadir una
// sección nueva es añadir una línea, no copiar y pegar un <Link> entero
const NAV_LINKS = [
   { label: 'Mujer', href: catalogRoute({ categoria: 'mujer' }) },
   { label: 'Hombre', href: catalogRoute({ categoria: 'hombre' }) },
   { label: 'Novedades', href: catalogRoute({ orden: 'novedades' }) },
   { label: 'Rebajas', href: catalogRoute({ rebajas: true }), highlight: true },
]

// Server Component (sin 'use client'): el header en sí no tiene estado.
// Las piezas que dependen del usuario (cuenta, favoritos, carrito) son
// "islas" de cliente; el resto se renderiza en el servidor sin enviar JS
export function Header() {
   return (
      // sticky + backdrop-blur: se queda arriba al hacer scroll y deja ver
      // el contenido difuminado por debajo, como en el diseño
      <header className="sticky top-0 z-40 border-b border-beige-3/50 bg-neutro-2/80 backdrop-blur-lg">
         <Container className="flex items-center justify-between py-[18px]">
            <Link
               href={ROUTES.home}
               className="font-bricolage-extrabold text-2xl tracking-[0.18em] text-brown-principal"
            >
               ÁMBAR
            </Link>

            {/* En móvil se oculta: el menú hamburguesa queda pendiente */}
            <nav
               aria-label="Principal"
               className="hidden gap-[30px] text-[13px] tracking-[0.04em] text-brown-2 md:flex"
            >
               {NAV_LINKS.map((link) => (
                  <Link
                     key={link.label}
                     href={link.href}
                     className={cn(
                        'border-b border-transparent pb-0.5 transition-colors',
                        link.highlight
                           ? 'text-coral-principal hover:border-coral-principal'
                           : 'hover:border-brown-principal',
                     )}
                  >
                     {link.label}
                  </Link>
               ))}
            </nav>

            <div className="flex items-center gap-[18px] text-brown-2">
               {/* TODO(búsqueda): de momento lleva al catálogo completo */}
               <Link
                  href={ROUTES.catalog}
                  aria-label="Buscar"
                  className="transition-opacity hover:opacity-70"
               >
                  <SpriteIcon
                     name="search-normal"
                     className="size-[19px]"
                  />
               </Link>
               <AccountMenu />
               <FavoritesLink />
               <CartButton />
            </div>
         </Container>
      </header>
   )
}

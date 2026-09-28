import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { AccountMenu } from './AccountMenu'
import { CartButton } from './cart/CartButton'
import { Container } from './Container'
import { FavoritesLink } from './favorites/FavoritesLink'
import { MobileMenu } from './MobileMenu'
import { NAV_LINKS } from './nav-links'
import { SearchDialog } from './SearchDialog'

// Server Component (sin 'use client'): el header en sí no tiene estado.
// Las piezas que dependen del usuario (cuenta, favoritos, carrito) son
// "islas" de cliente; el resto se renderiza en el servidor sin enviar JS
export function Header() {
   return (
      // sticky + backdrop-blur: se queda arriba al hacer scroll y deja ver
      // el contenido difuminado por debajo, como en el diseño
      <header className="sticky top-0 z-40 border-b border-beige-3/50 bg-neutro-2/80 backdrop-blur-lg">
         <Container className="flex items-center justify-between py-[18px]">
            <div className="flex items-center gap-2">
               {/* Solo en móvil (md:hidden dentro del componente) */}
               <MobileMenu />
               <Link
                  href={ROUTES.home}
                  className="font-bricolage-extrabold text-xl tracking-[0.18em] text-brown-principal md:text-2xl"
               >
                  ÁMBAR
               </Link>
            </div>

            {/* En móvil las secciones están en el menú ☰ (MobileMenu) */}
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
               {/* La lupa abre el buscador con sugerencias */}
               <SearchDialog />
               {/* En móvil la cuenta y los favoritos van dentro del menú ☰:
                   así el header no se amontona en pantallas pequeñas */}
               <div className="hidden items-center gap-[18px] md:flex">
                  <AccountMenu />
                  <FavoritesLink />
               </div>
               <CartButton />
            </div>
         </Container>
      </header>
   )
}

import { catalogRoute, ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { AccountMenu } from './AccountMenu'
import { CartButton } from './cart/CartButton'
import { Container } from './Container'
import { SpriteIcon, type SpriteIconName } from './SpriteIcon'

// Los menús se describen como DATOS y se pintan con un .map(): añadir una
// sección nueva es añadir una línea, no copiar y pegar un <Link> entero
const NAV_LINKS = [
   { label: 'Mujer', href: catalogRoute({ categoria: 'mujer' }) },
   { label: 'Hombre', href: catalogRoute({ categoria: 'hombre' }) },
   { label: 'Novedades', href: catalogRoute({ orden: 'novedades' }) },
   { label: 'Rebajas', href: catalogRoute({ rebajas: true }), highlight: true },
]

interface ActionLinkProps {
   label: string
   href: string
   icon: SpriteIconName
}

const SEARCH_LINK: ActionLinkProps = {
   label: 'Buscar',
   href: ROUTES.catalog,
   icon: 'search-normal',
}

const FAVORITES_LINK: ActionLinkProps = {
   label: 'Favoritos',
   href: ROUTES.favorites,
   icon: 'heart',
}

// Icono-enlace del header. Extraído a componente porque ahora se usa en dos
// sitios (antes y después del menú de cuenta)
function ActionLink({ label, href, icon }: ActionLinkProps) {
   return (
      <Link
         href={href}
         aria-label={label}
         className={cn(
            'transition-opacity hover:opacity-70',
            icon === 'heart' && 'text-coral-principal',
         )}
      >
         <SpriteIcon
            name={icon}
            className="size-[19px]"
         />
      </Link>
   )
}

// Server Component (sin 'use client'): no tiene estado ni eventos, así que
// se renderiza en el servidor y no añade JavaScript al navegador
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
               <ActionLink {...SEARCH_LINK} />
               {/* La cuenta depende de la sesión (cliente): es la única pieza
                   interactiva del header. El resto sigue siendo de servidor */}
               <AccountMenu />
               <ActionLink {...FAVORITES_LINK} />
               {/* La bolsa abre el drawer del carrito (isla de cliente) */}
               <CartButton />
            </div>
         </Container>
      </header>
   )
}

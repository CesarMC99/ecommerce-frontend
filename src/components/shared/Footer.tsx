import { catalogRoute, ROUTES } from '@/lib/routes'
import Link from 'next/link'
import { Container } from './Container'

interface FooterColumn {
   title: string
   // `href` es opcional: las páginas de "Ayuda" todavía no existen y un enlace
   // a una página inexistente es peor que un texto plano
   links: { label: string; href?: string }[]
}

const COLUMNS: FooterColumn[] = [
   {
      title: 'TIENDA',
      links: [
         { label: 'Mujer', href: catalogRoute({ categoria: 'mujer' }) },
         { label: 'Hombre', href: catalogRoute({ categoria: 'hombre' }) },
         { label: 'Novedades', href: catalogRoute({ orden: 'novedades' }) },
         { label: 'Rebajas', href: catalogRoute({ rebajas: true }) },
      ],
   },
   {
      title: 'AYUDA',
      links: [
         { label: 'Envíos y entregas' },
         { label: 'Devoluciones' },
         { label: 'Guía de tallas' },
         { label: 'Contacto' },
      ],
   },
   {
      title: 'CUENTA',
      links: [
         { label: 'Iniciar sesión', href: ROUTES.login },
         { label: 'Registrarse', href: ROUTES.register },
         { label: 'Mis pedidos', href: ROUTES.orders },
         { label: 'Favoritos', href: ROUTES.favorites },
      ],
   },
]

export function Footer() {
   return (
      <footer className="bg-brown-3 text-neutro-3">
         <Container className="grid gap-10 pt-16 pb-9 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div>
               <p className="font-bricolage-extrabold text-2xl tracking-[0.18em] text-neutro-2">
                  ÁMBAR
               </p>
               <p className="mt-4 max-w-60 text-[13px] leading-relaxed text-brown-1">
                  Moda esencial en tonos tierra. Diseñada para durar, hecha con
                  tejidos naturales.
               </p>
            </div>

            {COLUMNS.map((column) => (
               <div key={column.title}>
                  <p className="mb-4 text-xs tracking-[0.12em] text-neutro-2">
                     {column.title}
                  </p>
                  <ul className="flex flex-col gap-[11px] text-[13px] text-brown-1">
                     {column.links.map((link) => (
                        <li key={link.label}>
                           {link.href ? (
                              <Link
                                 href={link.href}
                                 className="transition-colors hover:text-neutro-2"
                              >
                                 {link.label}
                              </Link>
                           ) : (
                              link.label
                           )}
                        </li>
                     ))}
                  </ul>
               </div>
            ))}
         </Container>

         <div className="border-t border-white/10">
            <Container className="flex flex-col justify-between gap-2 py-5 text-xs tracking-[0.04em] text-brown-1 md:flex-row">
               {/* El año se calcula: así el footer no se queda en "2026" para siempre */}
               <span>
                  © {new Date().getFullYear()} ÁMBAR · Todos los derechos
                  reservados
               </span>
               <span>Privacidad · Términos · Cookies</span>
            </Container>
         </div>
      </footer>
   )
}

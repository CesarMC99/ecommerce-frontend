import { catalogRoute } from '@/lib/routes'

// Secciones de la tienda. Las usan el menú del header (escritorio) y el menú
// móvil: una sola lista, así nunca muestran secciones distintas
export const NAV_LINKS = [
   { label: 'Mujer', href: catalogRoute({ categoria: 'mujer' }) },
   { label: 'Hombre', href: catalogRoute({ categoria: 'hombre' }) },
   { label: 'Novedades', href: catalogRoute({ orden: 'novedades' }) },
   { label: 'Rebajas', href: catalogRoute({ rebajas: true }), highlight: true },
]

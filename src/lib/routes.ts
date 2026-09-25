// Única fuente de verdad para las URLs de la app.
// Si mañana `/catalogo` pasa a llamarse `/tienda`, se cambia aquí y no en
// veinte <Link> repartidos por el proyecto (que es donde nacen los enlaces rotos).

export const ROUTES = {
   home: '/',
   catalog: '/catalogo',
   cart: '/carrito',
   favorites: '/favoritos',
   orders: '/pedidos',
   profile: '/perfil',
   login: '/login',
   // Ya existía como '/register' en AuthHeroText: se respeta para no romperlo
   register: '/register',
} as const

// Parámetro con la página a la que volver tras iniciar sesión
export const REDIRECT_PARAM = 'redirigir'

/**
 * Devuelve la ruta SOLO si es interna de la tienda; si no, null.
 *
 * Evita el "open redirect": sin esta comprobación, alguien podría enviar
 * /login?redirigir=https://sitio-falso.com y, tras iniciar sesión, la
 * víctima acabaría en una web que imita a la nuestra (phishing).
 *  - Debe empezar por "/" (ruta del propio sitio)
 *  - No puede empezar por "//" ni "/\": el navegador los interpreta como
 *    "otro dominio" (//sitio-falso.com)
 */
export const getSafeRedirect = (value: string | null | undefined) => {
   if (!value || !value.startsWith('/')) return null
   if (value.startsWith('//') || value.startsWith('/\\')) return null
   return value
}

// Login y registro aceptan la página a la que volver después
const withRedirect = (path: string, redirectTo?: string | null) => {
   const safe = getSafeRedirect(redirectTo)
   return safe
      ? `${path}?${REDIRECT_PARAM}=${encodeURIComponent(safe)}`
      : path
}
export const loginRoute = (redirectTo?: string | null) =>
   withRedirect(ROUTES.login, redirectTo)
export const registerRoute = (redirectTo?: string | null) =>
   withRedirect(ROUTES.register, redirectTo)

// El detalle de producto depende del producto, por eso es una función.
// Usa el SLUG ('abrigo-de-lana') y no el id de Mongo: URLs legibles y
// mejores para buscadores (/producto/abrigo-de-lana)
export const productRoute = (slug: string) => `/producto/${slug}`

export const CATALOG_CATEGORIES = ['mujer', 'hombre', 'accesorios'] as const
export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number]

export const CATALOG_SORTS = [
   'destacados',
   'novedades',
   'precio-asc',
   'precio-desc',
   'valorados',
] as const
export type CatalogSort = (typeof CATALOG_SORTS)[number]

// Filtros del catálogo TAL COMO VIAJAN EN LA URL: en español y en euros,
// porque la URL la ve (y comparte) el usuario: /catalogo?categoria=mujer&precio=100
export interface CatalogFilters {
   categoria?: CatalogCategory
   color?: string
   talla?: string
   /** Precio máximo en EUROS (en la URL no tiene sentido hablar de céntimos) */
   precio?: number
   /** Valoración mínima: 4 → 4 estrellas o más */
   valoracion?: number
   rebajas?: boolean
   orden?: CatalogSort
   pagina?: number
}

// Los filtros del catálogo viajan en la URL (?categoria=mujer): así un
// catálogo filtrado se puede compartir, guardar o recargar sin perder el
// estado. Los valores por defecto NO se escriben (orden=destacados,
// pagina=1): así cada filtrado tiene UNA sola URL posible, más limpia
export const catalogRoute = (filters: CatalogFilters = {}) => {
   const params = new URLSearchParams()
   if (filters.categoria) params.set('categoria', filters.categoria)
   if (filters.color) params.set('color', filters.color)
   if (filters.talla) params.set('talla', filters.talla)
   if (filters.precio !== undefined) params.set('precio', String(filters.precio))
   if (filters.valoracion !== undefined) {
      params.set('valoracion', String(filters.valoracion))
   }
   if (filters.rebajas) params.set('rebajas', 'true')
   if (filters.orden && filters.orden !== 'destacados') {
      params.set('orden', filters.orden)
   }
   if (filters.pagina && filters.pagina > 1) {
      params.set('pagina', String(filters.pagina))
   }

   const query = params.toString()
   return query ? `${ROUTES.catalog}?${query}` : ROUTES.catalog
}

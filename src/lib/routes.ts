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

// El detalle de producto depende del producto, por eso es una función.
// Usa el SLUG ('abrigo-de-lana') y no el id de Mongo: URLs legibles y
// mejores para buscadores (/producto/abrigo-de-lana)
export const productRoute = (slug: string) => `/producto/${slug}`

export type CatalogCategory = 'mujer' | 'hombre' | 'accesorios'

interface CatalogFilters {
   categoria?: CatalogCategory
   orden?: 'novedades'
   rebajas?: boolean
}

// Los filtros del catálogo viajan en la URL (?categoria=mujer): así un
// catálogo filtrado se puede compartir, guardar o recargar sin perder el estado
export const catalogRoute = (filters: CatalogFilters = {}) => {
   const params = new URLSearchParams()
   if (filters.categoria) params.set('categoria', filters.categoria)
   if (filters.orden) params.set('orden', filters.orden)
   if (filters.rebajas) params.set('rebajas', 'true')

   const query = params.toString()
   return query ? `${ROUTES.catalog}?${query}` : ROUTES.catalog
}

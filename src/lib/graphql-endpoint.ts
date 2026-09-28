/**
 * A dónde se envían las peticiones GraphQL.
 *
 * - NAVEGADOR: NEXT_PUBLIC_GRAPHQL_API_URL. En producción vale "/graphql"
 *   (el MISMO dominio de la tienda): Vercel la reenvía al backend (ver
 *   `rewrites` en next.config.ts). Así la cookie del refresh token es "de
 *   la casa"; si el navegador hablara directamente con otro dominio
 *   (onrender.com), la trataría como cookie de terceros y la bloquearía:
 *   la sesión se perdería al recargar. En local vale la URL del backend.
 * - SERVIDOR (Server Components): una ruta relativa como "/graphql" no
 *   significa nada fuera del navegador, así que usa GRAPHQL_API_URL (URL
 *   completa del backend, sin NEXT_PUBLIC: nunca llega al navegador). Si no
 *   está definida (en local), usa la pública.
 */
export const GRAPHQL_ENDPOINT =
   typeof window === 'undefined'
      ? (process.env.GRAPHQL_API_URL ?? process.env.NEXT_PUBLIC_GRAPHQL_API_URL!)
      : process.env.NEXT_PUBLIC_GRAPHQL_API_URL!

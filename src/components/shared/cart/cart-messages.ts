import type { CartLineUnavailableReason } from '@/graphql/generated/graphql'

// Texto para el usuario según el motivo que envía el backend. El backend
// manda un CÓDIGO (estable) y el frontend decide la frase (puede cambiar
// sin tocar la API, o traducirse a otro idioma)
export const UNAVAILABLE_MESSAGES: Record<CartLineUnavailableReason, string> = {
   PRODUCT_NOT_FOUND: 'Este producto ya no existe.',
   PRODUCT_UNAVAILABLE: 'Este producto ya no está a la venta.',
   SIZE_NOT_FOUND: 'Esta talla ya no está disponible.',
   OUT_OF_STOCK: 'Esta talla se ha agotado.',
}

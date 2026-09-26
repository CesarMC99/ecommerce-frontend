import type { OrderStatus } from '@/graphql/generated/graphql'

// 'MX' → 'México'. Lo traduce el propio navegador: no hace falta otra
// petición al backend solo para el nombre del país
const COUNTRY_NAMES = new Intl.DisplayNames(['es'], { type: 'region' })
export const countryName = (code: string) => COUNTRY_NAMES.of(code) ?? code

// "25 de septiembre de 2026"
const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' })
export const formatOrderDate = (iso: string) => DATE_FORMAT.format(new Date(iso))

/**
 * Texto y color de cada estado. Record<OrderStatus, ...>: si el backend
 * añade un estado nuevo (p. ej. "Enviado"), TypeScript obliga a darle
 * texto aquí, así nunca se muestra un "SHIPPED" en crudo.
 */
export const ORDER_STATUS_UI: Record<OrderStatus, { label: string; className: string }> = {
   PAID: { label: 'Pagado', className: 'bg-success/10 text-success' },
   PENDING_PAYMENT: {
      label: 'Pendiente de pago',
      className: 'bg-beige-1 text-brown-2',
   },
   CANCELLED: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive' },
}

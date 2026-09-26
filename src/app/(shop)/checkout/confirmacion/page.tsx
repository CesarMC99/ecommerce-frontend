import { OrderConfirmationContent } from '@/features/(shop)/checkout/OrderConfirmationContent'
import { ORDER_PARAM } from '@/lib/routes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Pedido confirmado · ÁMBAR',
   robots: { index: false },
}

interface ConfirmationPageProps {
   // Next 16: searchParams es una Promise
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Aquí se llega tras pagar (desde el checkout o de vuelta de la
// verificación 3-D Secure del banco): /checkout/confirmacion?pedido=<id>
export default async function ConfirmationPage({
   searchParams,
}: ConfirmationPageProps) {
   const params = await searchParams
   const orderId = params[ORDER_PARAM]
   return (
      <OrderConfirmationContent
         orderId={typeof orderId === 'string' ? orderId : null}
      />
   )
}

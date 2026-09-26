import { OrderDetailContent } from '@/features/(shop)/orders/OrderDetailContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Detalle del pedido · ÁMBAR',
   robots: { index: false },
}

interface OrderPageProps {
   // Next 16: params es una Promise
   params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: OrderPageProps) {
   const { id } = await params
   return <OrderDetailContent orderId={id} />
}

import { OrdersPageContent } from '@/features/(shop)/orders/OrdersPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Mis pedidos · ÁMBAR',
   // Datos personales: fuera de los buscadores
   robots: { index: false },
}

interface OrdersPageProps {
   // Next 16: searchParams es una Promise
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
   const { pagina } = await searchParams
   // ?pagina=abc o ?pagina=-3 → página 1 (nunca rompe la página)
   const page = Math.max(1, Number.parseInt(typeof pagina === 'string' ? pagina : '1', 10) || 1)
   return <OrdersPageContent page={page} />
}

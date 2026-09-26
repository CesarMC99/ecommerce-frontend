import { CheckoutPageContent } from '@/features/(shop)/checkout/CheckoutPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Finalizar compra · ÁMBAR',
   // Página personal: no tiene sentido que Google la indexe
   robots: { index: false },
}

// La sesión y el carrito viven en el navegador: el contenido es de cliente
export default function CheckoutPage() {
   return <CheckoutPageContent />
}

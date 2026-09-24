import { CartPageContent } from '@/features/(shop)/cart/CartPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Tu carrito · ÁMBAR',
   // Un carrito es personal: no tiene sentido que Google lo indexe
   robots: { index: false },
}

// La página es de servidor solo para la metadata; el contenido es de
// cliente porque el carrito de invitado vive en el navegador
export default function CartPage() {
   return <CartPageContent />
}

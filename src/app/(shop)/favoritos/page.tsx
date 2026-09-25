import { FavoritesPageContent } from '@/features/(shop)/favorites/FavoritesPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Favoritos · ÁMBAR',
   // Lista personal: no tiene sentido que Google la indexe
   robots: { index: false },
}

export default function FavoritesPage() {
   return <FavoritesPageContent />
}

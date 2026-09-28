import { ProfilePageContent } from '@/features/(shop)/profile/ProfilePageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Mi perfil · ÁMBAR',
   // Datos personales: fuera de los buscadores
   robots: { index: false },
}

export default function ProfilePage() {
   return <ProfilePageContent />
}

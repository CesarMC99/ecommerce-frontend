import { RequestResetForm } from '@/features/(auth)/password-recovery/RequestResetForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Recuperar contraseña · ÁMBAR',
   robots: { index: false },
}

export default function PasswordRecoveryPage() {
   return <RequestResetForm />
}

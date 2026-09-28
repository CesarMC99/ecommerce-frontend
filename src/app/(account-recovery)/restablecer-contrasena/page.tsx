import { ResetPasswordForm } from '@/features/(auth)/password-recovery/ResetPasswordForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Nueva contraseña · ÁMBAR',
   robots: { index: false },
   // El token viaja en la URL: que el navegador no lo mande a otras webs
   // en la cabecera Referer si el usuario pulsa un enlace externo
   referrer: 'no-referrer',
}

interface ResetPasswordPageProps {
   // Next 16: searchParams es una Promise
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

// Destino del enlace del correo: /restablecer-contrasena?token=...
export default async function ResetPasswordPage({
   searchParams,
}: ResetPasswordPageProps) {
   const { token } = await searchParams
   return <ResetPasswordForm token={typeof token === 'string' ? token : null} />
}

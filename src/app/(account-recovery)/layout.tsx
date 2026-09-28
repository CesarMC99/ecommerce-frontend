import { AuthShell } from '@/features/(auth)/shared/AuthShell'
import React from 'react'

// Mismo diseño que el login, pero SIN GuestGuard: una cuenta de Google ya
// logueada también necesita llegar aquí para crear su contraseña
export default function AccountRecoveryLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return <AuthShell>{children}</AuthShell>
}

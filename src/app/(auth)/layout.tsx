import { AuthShell } from '@/features/(auth)/shared/AuthShell'
import { GuestGuard } from '@/features/(auth)/shared/GuestGuard'
import React from 'react'

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      // El guard envuelve TODO el layout: login y registro quedan protegidos
      // a la vez, y cualquier página nueva de este grupo también lo estará
      <GuestGuard>
         <AuthShell>{children}</AuthShell>
      </GuestGuard>
   )
}

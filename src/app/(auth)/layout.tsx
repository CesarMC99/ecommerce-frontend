import { AuthHeroText } from '@/features/(auth)/components/AuthHeroText'
import React from 'react'

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <main className="flex">
         <div className="flex flex-col justify-between h-screen basis-1/2 px-12 py-14 layout-auth-bg">
            <span className="font-bricolage-extrabold text-white text-2xl tracking-[0.18em]">
               ÁMBAR
            </span>

            <AuthHeroText />

            <div className="layout-auth-bg-lines"></div>
         </div>

         <div className="basis-1/2 bg-transparent flex justify-center items-center">
            {children}
         </div>
      </main>
   )
}

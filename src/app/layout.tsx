import { GuestDataSync } from '@/components/shared/GuestDataSync'
import { ApolloWrapper } from '@/providers/ApolloProvider'
import { SessionProvider } from '@/providers/SessionProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
   title: 'ÁMBAR · El guardarropa esencial',
   description: 'Moda esencial en tonos tierra, hecha con tejidos naturales.',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html
         lang="es"
         className={'antialiased'}
      >
         <body className="font-helvetica-roman bg-neutro-2">
            <GoogleOAuthProvider
               clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
               locale="es"
            >
               <ApolloWrapper>
                  {/* Dentro de Apollo: la sesión necesita el cliente GraphQL */}
                  <SessionProvider>
                     {/* Lee el carrito y los favoritos de invitado y los fusiona al iniciar
                         sesión. Aquí (y no en la tienda) para que funcione
                         también cuando el login ocurre en /login */}
                     <GuestDataSync />
                     {children}
                  </SessionProvider>
               </ApolloWrapper>
            </GoogleOAuthProvider>
         </body>
      </html>
   )
}

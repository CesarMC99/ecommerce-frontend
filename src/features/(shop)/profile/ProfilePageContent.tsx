'use client'

import { AuthGuard } from '@/components/shared/AuthGuard'
import { Container } from '@/components/shared/Container'
import { ROUTES } from '@/lib/routes'
import { useSession } from '@/providers/SessionProvider'
import Link from 'next/link'
import { formatOrderDate } from '../orders/order-format'
import { ChangePasswordForm } from './ChangePasswordForm'
import { ProfileForm } from './ProfileForm'

export function ProfilePageContent() {
   return (
      <Container className="max-w-[760px] pt-8 pb-[72px]">
         <nav
            aria-label="Ruta de navegación"
            className="mb-3.5 text-xs tracking-[0.04em] text-brown-1"
         >
            <Link
               href={ROUTES.home}
               className="hover:text-brown-principal"
            >
               Inicio
            </Link>
            <span aria-hidden> / </span>
            <span
               aria-current="page"
               className="text-brown-principal"
            >
               Mi perfil
            </span>
         </nav>
         <h1 className="mb-8 font-bricolage-bold text-[40px] tracking-[-0.02em] text-brown-principal">
            Mi perfil
         </h1>
         <AuthGuard>
            <Profile />
         </AuthGuard>
      </Container>
   )
}

function Profile() {
   // AuthGuard garantiza que aquí ya hay sesión (user no es null)
   const { user } = useSession()
   if (!user) return null

   return (
      <div className="flex flex-col gap-6">
         <Card
            title="Datos personales"
            description={`Cliente desde el ${formatOrderDate(user.createdAt)}`}
         >
            {/* key: si cambia el usuario, el formulario empieza de cero */}
            <ProfileForm
               key={user.id}
               user={user}
            />
         </Card>

         <Card
            title="Contraseña"
            description="Te pediremos la actual para confirmar que eres tú."
         >
            {user.hasPassword ? (
               <ChangePasswordForm />
            ) : (
               // Cuenta creada con Google: no tiene contraseña. Crearla desde
               // aquí sería inseguro (bastaría una sesión robada); con
               // "recuperar contraseña" demuestra que el correo es suyo
               <p className="rounded-md bg-neutro-3 px-4 py-3 text-[13px] leading-relaxed text-brown-2">
                  Inicias sesión con Google, así que tu cuenta no tiene contraseña
                  propia. Si quieres crear una para entrar también con tu correo,{' '}
                  <Link
                     href={ROUTES.passwordRecovery}
                     className="text-coral-principal hover:underline"
                  >
                     solicítala aquí
                  </Link>
                  : te enviaremos un enlace a {user.email}.
               </p>
            )}
         </Card>

         <div className="flex flex-wrap gap-3 text-[13px]">
            <Link
               href={ROUTES.orders}
               className="rounded-md border border-beige-2 bg-neutro-1 px-4 py-2.5 text-brown-2 hover:border-brown-1"
            >
               Mis pedidos →
            </Link>
            <Link
               href={ROUTES.favorites}
               className="rounded-md border border-beige-2 bg-neutro-1 px-4 py-2.5 text-brown-2 hover:border-brown-1"
            >
               Favoritos →
            </Link>
         </div>
      </div>
   )
}

interface CardProps {
   title: string
   description: string
}

function Card({ title, description, children }: React.PropsWithChildren<CardProps>) {
   return (
      <section className="rounded-md border border-beige-2 bg-neutro-1 p-6 sm:p-8">
         <h2 className="font-bricolage-semibold text-2xl text-brown-principal">
            {title}
         </h2>
         <p className="mt-1 mb-6 text-[13px] text-brown-1">{description}</p>
         {children}
      </section>
   )
}

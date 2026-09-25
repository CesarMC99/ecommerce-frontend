import { AuthBase } from '@/features/(auth)/shared/AuthBase'
import { RegisterForm } from '@/features/(auth)/register/RegisterForm'
import { loginRoute, REDIRECT_PARAM } from '@/lib/routes'

type RegisterPageProps = {
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
   const redirectTo = (await searchParams)[REDIRECT_PARAM]

   return (
      <AuthBase
         title="Crear cuenta"
         subtitleText="¿Ya tienes cuenta?"
         linkText="Inicia sesión"
         // Si venía con ?redirigir=, se conserva al saltar al login: el
         // usuario volverá a la página de origen entre por donde entre
         // (loginRoute valida que sea una ruta interna)
         linkHref={loginRoute(typeof redirectTo === 'string' ? redirectTo : null)}
      >
         <RegisterForm />
      </AuthBase>
   )
}

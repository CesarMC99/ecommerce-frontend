import { LoginForm } from '@/features/(auth)/login/LoginForm'
import { AuthBase } from '@/features/(auth)/shared/AuthBase'
import { REDIRECT_PARAM, registerRoute } from '@/lib/routes'

type LoginPageProps = {
   searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
   const redirectTo = (await searchParams)[REDIRECT_PARAM]

   return (
      <AuthBase
         title="Inicia sesión"
         subtitleText="¿Aún no tienes cuenta?"
         linkText="Regístrate"
         // Conserva la página de origen al saltar al registro (validada)
         linkHref={registerRoute(
            typeof redirectTo === 'string' ? redirectTo : null,
         )}
      >
         <LoginForm />
      </AuthBase>
   )
}

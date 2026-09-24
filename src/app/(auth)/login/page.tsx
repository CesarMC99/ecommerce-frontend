import { LoginForm } from '@/features/(auth)/login/LoginForm'
import { AuthBase } from '@/features/(auth)/shared/AuthBase'
import { ROUTES } from '@/lib/routes'

export default function LoginPage() {
   return (
      <AuthBase
         title="Inicia sesión"
         subtitleText="¿Aún no tienes cuenta?"
         linkText="Regístrate"
         linkHref={ROUTES.register}
      >
         <LoginForm />
      </AuthBase>
   )
}

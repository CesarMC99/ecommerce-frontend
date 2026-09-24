import { AuthBase } from '@/features/(auth)/shared/AuthBase'
import { RegisterForm } from '@/features/(auth)/register/RegisterForm'
import { ROUTES } from '@/lib/routes'

export default function RegisterPage() {
   return (
      <AuthBase
         title="Crear cuenta"
         subtitleText="¿Ya tienes cuenta?"
         linkText="Inicia sesión"
         linkHref={ROUTES.login}
      >
         <RegisterForm />
      </AuthBase>
   )
}

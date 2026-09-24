'use client'

import { Button } from '@/components/ui/button'
import { LOGIN_WITH_GOOGLE } from '@/graphql/modules/auth/fragments/login.fragment'
import { setAuthToken } from '@/lib/auth-token'
import { useMutation } from '@apollo/client/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'

export function GoogleLoginButton() {
   const router = useRouter()
   const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE)

   // flow 'auth-code': Google abre un popup y nos devuelve un CODE de un
   // solo uso. El navegador nunca ve tokens: el canje lo hace el backend
   const startGoogleLogin = useGoogleLogin({
      flow: 'auth-code',
      onSuccess: async ({ code }) => {
         const { data } = await loginWithGoogle({
            variables: { input: { code } },
         })
         if (data) {
            // El backend canjeó el code, verificó la identidad y emitió
            // los suyos: accessToken aquí, refresh token en cookie httpOnly
            setAuthToken(data.loginWithGoogle.accessToken)
            router.push('/')
         }
      },
      onError: () => console.error('Google no completó el login'),
   })

   return (
      <Button
         variant={'google'}
         type="button"
         className="flex items-center justify-center gap-2"
         onClick={() => startGoogleLogin()}
      >
         <svg className="size-4 text-coral-principal">
            <use href="/images/icons/sprite.svg#google" />
         </svg>
         <span>Continuar con Google</span>
      </Button>
   )
}

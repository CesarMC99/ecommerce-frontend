'use client'

import { Button } from '@/components/ui/button'
import { LOGIN_WITH_GOOGLE } from '@/graphql/modules/auth/fragments/login.fragment'
import { getErrorMessage } from '@/lib/graphql-error'
import { useMutation } from '@apollo/client/react'
import { useGoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { FormServerError } from './FormServerError'
import { useCompleteAuth } from './use-complete-auth'

export function GoogleLoginButton() {
   const completeAuth = useCompleteAuth()
   const [loginWithGoogle, { loading }] = useMutation(LOGIN_WITH_GOOGLE)
   // Este botón vive FUERA de los formularios, así que maneja su propio error
   const [error, setError] = useState<string>()

   // flow 'auth-code': Google abre un popup y nos devuelve un CODE de un
   // solo uso. El navegador nunca ve tokens: el canje lo hace el backend
   const startGoogleLogin = useGoogleLogin({
      flow: 'auth-code',
      onSuccess: async ({ code }) => {
         setError(undefined)
         try {
            const { data } = await loginWithGoogle({
               variables: { input: { code } },
            })
            // El backend canjeó el code, verificó la identidad y emitió
            // los suyos: accessToken aquí, refresh token en cookie httpOnly
            if (data) completeAuth(data.loginWithGoogle)
         } catch (mutationError) {
            // Antes este error se perdía (promesa rechazada sin capturar)
            // y el usuario veía que "no pasaba nada" al volver del popup
            setError(getErrorMessage(mutationError))
         }
      },
      // El usuario cerró el popup o Google rechazó el acceso
      onError: () => setError('Google no completó el inicio de sesión.'),
   })

   return (
      <div className="flex flex-col gap-3">
         <Button
            variant={'google'}
            type="button"
            disabled={loading}
            className="flex items-center justify-center gap-2"
            onClick={() => startGoogleLogin()}
         >
            <svg className="size-4 text-coral-principal">
               <use href="/images/icons/sprite.svg#google" />
            </svg>
            <span>{loading ? 'Conectando…' : 'Continuar con Google'}</span>
         </Button>
         <FormServerError message={error} />
      </div>
   )
}

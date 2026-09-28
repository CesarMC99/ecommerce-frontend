'use client'

import { InputField } from '@/components/shared/InputField'
import { FieldGroup } from '@/components/ui/field'
import { REQUEST_PASSWORD_RESET } from '@/graphql/modules/auth/mutations/password-reset.mutations'
import { getErrorMessage } from '@/lib/graphql-error'
import { ROUTES } from '@/lib/routes'
import { useSession } from '@/providers/SessionProvider'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormServerError } from '../shared/FormServerError'
import { SubmitButton } from '../shared/SubmitButton'
import { RecoveryPanel } from './RecoveryPanel'
import {
   requestResetSchema,
   type RequestResetFormValues,
} from './password-recovery.schemas'

// "¿Olvidaste tu contraseña?": pide el correo y envía el enlace
export function RequestResetForm() {
   const { status } = useSession()
   // Hasta saber si hay sesión no se monta el formulario: sus valores
   // iniciales (el correo del usuario) solo se leen al montarse
   if (status === 'loading') {
      return (
         <span
            role="status"
            aria-label="Cargando"
            className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal"
         />
      )
   }
   return <RequestResetFormContent />
}

function RequestResetFormContent() {
   const { status, user } = useSession()
   const [requestReset] = useMutation(REQUEST_PASSWORD_RESET)
   const [sentTo, setSentTo] = useState<string | null>(null)

   const form = useForm<RequestResetFormValues>({
      resolver: zodResolver(requestResetSchema),
      // Con sesión (cuenta de Google que viene del perfil) ya sabemos su correo
      defaultValues: { email: user?.email ?? '' },
   })
   const isSubmitting = form.formState.isSubmitting
   const isLoggedIn = status === 'authenticated'

   const onSubmit = async ({ email }: RequestResetFormValues) => {
      try {
         await requestReset({ variables: { input: { email: email.trim() } } })
         setSentTo(email.trim())
      } catch (error) {
         form.setError('root.server', { message: getErrorMessage(error) })
      }
   }

   const back = isLoggedIn
      ? { href: ROUTES.profile, label: 'Volver a mi perfil' }
      : { href: ROUTES.login, label: 'Volver a iniciar sesión' }

   if (sentTo) {
      return (
         <RecoveryPanel
            title="Revisa tu correo"
            description={
               // El MISMO mensaje exista o no la cuenta: la página no puede
               // servir para averiguar qué correos están registrados
               <>
                  Si <strong className="text-brown-principal">{sentTo}</strong>{' '}
                  tiene una cuenta en ÁMBAR, te hemos enviado un enlace para
                  elegir una contraseña nueva. Caduca en 30 minutos.
               </>
            }
            backHref={back.href}
            backLabel={back.label}
         >
            <p className="rounded-md bg-neutro-3 px-4 py-3 text-[13px] leading-relaxed text-brown-2">
               ¿No te llega? Mira en la carpeta de spam o promociones. Puedes
               pedir otro enlace dentro de un minuto.
            </p>
            <button
               type="button"
               onClick={() => setSentTo(null)}
               className="w-fit cursor-pointer text-[13px] text-coral-principal hover:underline"
            >
               Usar otro correo
            </button>
         </RecoveryPanel>
      )
   }

   return (
      <RecoveryPanel
         title={isLoggedIn ? 'Crea tu contraseña' : '¿Olvidaste tu contraseña?'}
         description="Escribe tu correo y te enviaremos un enlace para elegir una contraseña nueva."
         backHref={back.href}
         backLabel={back.label}
      >
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
         >
            <FieldGroup>
               <InputField
                  name="email"
                  control={form.control}
                  label="CORREO ELECTRÓNICO"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  disabled={isSubmitting}
               />
            </FieldGroup>
            <div className="flex flex-col gap-4">
               <FormServerError message={form.formState.errors.root?.server?.message} />
               <SubmitButton
                  isLoading={isSubmitting}
                  label="Enviar enlace"
                  loadingLabel="Enviando…"
               />
            </div>
         </form>
      </RecoveryPanel>
   )
}

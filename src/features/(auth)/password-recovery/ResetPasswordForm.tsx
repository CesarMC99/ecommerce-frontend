'use client'

import { InputField } from '@/components/shared/InputField'
import { FieldGroup } from '@/components/ui/field'
import { RESET_PASSWORD } from '@/graphql/modules/auth/mutations/password-reset.mutations'
import { getErrorMessage } from '@/lib/graphql-error'
import { ROUTES } from '@/lib/routes'
import { useSession } from '@/providers/SessionProvider'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PasswordStrengthMeter } from '../register/PasswordStrengthMeter'
import { FormServerError } from '../shared/FormServerError'
import { SubmitButton } from '../shared/SubmitButton'
import { RecoveryPanel } from './RecoveryPanel'
import {
   resetPasswordSchema,
   type ResetPasswordFormValues,
} from './password-recovery.schemas'

const primaryLinkClass =
   'inline-block rounded-md bg-coral-principal px-6 py-3.5 text-center text-sm text-white hover:bg-coral-4'

// Página a la que lleva el enlace del correo: elegir la contraseña nueva
export function ResetPasswordForm({ token }: { token: string | null }) {
   const { status, signOut } = useSession()
   const [resetPassword] = useMutation(RESET_PASSWORD)
   const [done, setDone] = useState(false)

   const form = useForm<ResetPasswordFormValues>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: { newPassword: '', confirmPassword: '' },
   })
   const isSubmitting = form.formState.isSubmitting
   const newPassword = useWatch({ control: form.control, name: 'newPassword' })

   if (!token) {
      return (
         <RecoveryPanel
            title="Enlace no válido"
            description="Falta el código del enlace. Ábrelo tal cual desde el correo o pide uno nuevo."
            backHref={ROUTES.login}
            backLabel="Volver a iniciar sesión"
         >
            <Link
               href={ROUTES.passwordRecovery}
               className={primaryLinkClass}
            >
               Pedir un enlace nuevo
            </Link>
         </RecoveryPanel>
      )
   }

   const onSubmit = async ({ newPassword }: ResetPasswordFormValues) => {
      try {
         await resetPassword({ variables: { input: { token, newPassword } } })
         // El backend ha cerrado TODAS las sesiones. Si este navegador tenía
         // una abierta, se cierra también aquí para no dejarla a medias
         if (status === 'authenticated') await signOut()
         setDone(true)
      } catch (error) {
         // "El enlace no es válido o ha caducado" (ya usado, caducado...)
         form.setError('root.server', { message: getErrorMessage(error) })
      }
   }

   if (done) {
      return (
         <RecoveryPanel
            title="Contraseña guardada"
            description="Ya puedes iniciar sesión con tu contraseña nueva. Por seguridad, hemos cerrado la sesión en todos tus dispositivos."
            backHref={ROUTES.home}
            backLabel="Ir a la tienda"
         >
            <Link
               href={ROUTES.login}
               className={primaryLinkClass}
            >
               Iniciar sesión
            </Link>
         </RecoveryPanel>
      )
   }

   const serverError = form.formState.errors.root?.server?.message

   return (
      <RecoveryPanel
         title="Elige una contraseña nueva"
         description="Usa al menos 8 caracteres. Mejor si mezclas letras, números y símbolos."
         backHref={ROUTES.login}
         backLabel="Volver a iniciar sesión"
      >
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
         >
            <FieldGroup>
               <div className="flex flex-col gap-2">
                  <InputField
                     name="newPassword"
                     control={form.control}
                     label="NUEVA CONTRASEÑA"
                     type="password"
                     autoComplete="new-password"
                     disabled={isSubmitting}
                  />
                  <PasswordStrengthMeter password={newPassword} />
               </div>
               <InputField
                  name="confirmPassword"
                  control={form.control}
                  label="REPITE LA CONTRASEÑA"
                  type="password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
               />
            </FieldGroup>
            <div className="flex flex-col gap-4">
               <FormServerError message={serverError} />
               {/* Enlace caducado o ya usado: el camino es pedir otro */}
               {serverError && (
                  <Link
                     href={ROUTES.passwordRecovery}
                     className="text-[13px] text-coral-principal hover:underline"
                  >
                     Pedir un enlace nuevo
                  </Link>
               )}
               <SubmitButton
                  isLoading={isSubmitting}
                  label="Guardar contraseña"
                  loadingLabel="Guardando…"
               />
            </div>
         </form>
      </RecoveryPanel>
   )
}

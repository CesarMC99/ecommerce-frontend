'use client'

import { InputField } from '@/components/shared/InputField'
import { FieldGroup } from '@/components/ui/field'
import { CHANGE_PASSWORD } from '@/graphql/modules/auth/mutations/profile.mutations'
import { getErrorMessage } from '@/lib/graphql-error'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PasswordStrengthMeter } from '../../(auth)/register/PasswordStrengthMeter'
import { FormServerError } from '../../(auth)/shared/FormServerError'
import { SubmitButton } from '../../(auth)/shared/SubmitButton'
import {
   changePasswordSchema,
   type ChangePasswordFormValues,
} from './profile.schemas'

const EMPTY: ChangePasswordFormValues = {
   currentPassword: '',
   newPassword: '',
   confirmPassword: '',
}

export function ChangePasswordForm() {
   const [changePassword] = useMutation(CHANGE_PASSWORD)
   const [changed, setChanged] = useState(false)

   const form = useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: EMPTY,
   })
   const isSubmitting = form.formState.isSubmitting
   // useWatch: el medidor se actualiza mientras se escribe
   const newPassword = useWatch({ control: form.control, name: 'newPassword' })

   const onSubmit = async (values: ChangePasswordFormValues) => {
      setChanged(false)
      try {
         await changePassword({
            variables: {
               input: {
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
               },
            },
         })
         // Las contraseñas no se quedan en pantalla una vez usadas
         form.reset(EMPTY)
         setChanged(true)
      } catch (error) {
         // "La contraseña actual no es correcta", etc. (mensajes del backend)
         form.setError('root.server', { message: getErrorMessage(error) })
      }
   }

   return (
      <form
         onSubmit={form.handleSubmit(onSubmit)}
         noValidate
         className="flex flex-col gap-6"
      >
         <FieldGroup>
            <InputField
               name="currentPassword"
               control={form.control}
               label="CONTRASEÑA ACTUAL"
               type="password"
               autoComplete="current-password"
               disabled={isSubmitting}
            />
            <div className="flex flex-col gap-2">
               <InputField
                  name="newPassword"
                  control={form.control}
                  label="NUEVA CONTRASEÑA"
                  type="password"
                  // new-password: el gestor de contraseñas propone una segura
                  autoComplete="new-password"
                  disabled={isSubmitting}
               />
               <PasswordStrengthMeter password={newPassword} />
            </div>
            <InputField
               name="confirmPassword"
               control={form.control}
               label="REPITE LA NUEVA CONTRASEÑA"
               type="password"
               autoComplete="new-password"
               disabled={isSubmitting}
            />
         </FieldGroup>

         <div className="flex flex-col gap-3">
            <FormServerError message={form.formState.errors.root?.server?.message} />
            {changed && (
               <p
                  role="status"
                  className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-[13px] text-success"
               >
                  ✓ Contraseña actualizada. Por seguridad, hemos cerrado la
                  sesión en tus otros dispositivos y te hemos enviado un aviso
                  por correo.
               </p>
            )}
            <SubmitButton
               isLoading={isSubmitting}
               label="Cambiar contraseña"
               loadingLabel="Cambiando…"
            />
         </div>
      </form>
   )
}

'use client'

import { InputField } from '@/components/shared/InputField'
import { FieldGroup } from '@/components/ui/field'
import { UPDATE_PROFILE } from '@/graphql/modules/auth/mutations/profile.mutations'
import { getErrorMessage } from '@/lib/graphql-error'
import { useSession, type SessionUser } from '@/providers/SessionProvider'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormServerError } from '../../(auth)/shared/FormServerError'
import { SubmitButton } from '../../(auth)/shared/SubmitButton'
import { profileSchema, type ProfileFormValues } from './profile.schemas'

// Datos personales: el nombre se puede cambiar; el correo es de solo lectura
export function ProfileForm({ user }: { user: SessionUser }) {
   const { updateUser } = useSession()
   const [updateProfile] = useMutation(UPDATE_PROFILE)
   const [saved, setSaved] = useState(false)

   const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: user.name },
   })
   const { isSubmitting, isDirty } = form.formState

   const onSubmit = async (values: ProfileFormValues) => {
      setSaved(false)
      try {
         const { data } = await updateProfile({ variables: { input: values } })
         if (!data) return
         // La sesión (y el "Hola, …" del menú) muestran ya el nombre nuevo
         updateUser(data.updateProfile)
         // El valor guardado pasa a ser el "inicial": el botón vuelve a
         // desactivarse hasta que se cambie algo otra vez
         form.reset({ name: data.updateProfile.name })
         setSaved(true)
      } catch (error) {
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
               name="name"
               control={form.control}
               label="NOMBRE Y APELLIDOS"
               autoComplete="name"
               disabled={isSubmitting}
            />
            <div>
               <p className="mb-2 text-xs tracking-[0.06em] text-brown-1">
                  CORREO ELECTRÓNICO
               </p>
               <p className="rounded-md border border-beige-2 bg-neutro-2 px-4 py-3.5 text-sm text-brown-2">
                  {user.email}
               </p>
               <p className="mt-1.5 text-xs text-brown-1">
                  Es el correo con el que inicias sesión y al que enviamos los
                  avisos de tu cuenta. Por ahora no se puede cambiar.
               </p>
            </div>
         </FieldGroup>

         <div className="flex flex-col gap-3">
            <FormServerError message={form.formState.errors.root?.server?.message} />
            {saved && !isDirty && (
               <p
                  role="status"
                  className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-[13px] text-success"
               >
                  ✓ Datos guardados
               </p>
            )}
            {/* Sin cambios no hay nada que guardar */}
            <fieldset
               disabled={!isDirty}
               className="contents"
            >
               <SubmitButton
                  isLoading={isSubmitting}
                  label="Guardar cambios"
                  loadingLabel="Guardando…"
               />
            </fieldset>
         </div>
      </form>
   )
}

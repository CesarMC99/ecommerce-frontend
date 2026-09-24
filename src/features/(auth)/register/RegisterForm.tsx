'use client'

import { CheckboxField } from '@/components/shared/CheckboxField'
import { InputField } from '@/components/shared/InputField'
import { FieldGroup } from '@/components/ui/field'
import { REGISTER } from '@/graphql/modules/auth/mutations/register.mutation'
import { getErrorMessage, getGraphQLErrorCode } from '@/lib/graphql-error'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { FormServerError } from '../shared/FormServerError'
import { SubmitButton } from '../shared/SubmitButton'
import { useCompleteAuth } from '../shared/use-complete-auth'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { registerSchema, type RegisterFormValues } from './register.schema'

export const RegisterForm = () => {
   const completeAuth = useCompleteAuth()
   const [registerUser] = useMutation(REGISTER)

   const form = useForm<RegisterFormValues>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         firstName: '',
         lastName: '',
         email: '',
         password: '',
         confirmPassword: '',
         terms: false,
      },
   })

   // useWatch se suscribe SOLO a este campo: el medidor se actualiza en cada
   // tecla sin volver a renderizar el formulario entero
   const password = useWatch({ control: form.control, name: 'password' })

   const isSubmitting = form.formState.isSubmitting

   const onSubmit = async (values: RegisterFormValues) => {
      try {
         const { data } = await registerUser({
            variables: {
               input: {
                  // El backend guarda un único `name`: el diseño pide nombre y
                  // apellidos por separado, así que se unen aquí
                  name: `${values.firstName} ${values.lastName}`,
                  email: values.email.trim(),
                  password: values.password,
                  // confirmPassword y terms NO se envían: son reglas de la UI.
                  // Además, el ValidationPipe del backend (forbidNonWhitelisted)
                  // rechazaría la petición entera por campos desconocidos
               },
            },
         })
         // El backend ya devuelve tokens: registrarse deja la sesión iniciada
         if (data) completeAuth(data.register)
      } catch (error) {
         // Email ya registrado → el error se muestra EN el campo email,
         // que es donde el usuario tiene que corregir
         if (getGraphQLErrorCode(error) === 'CONFLICT') {
            form.setError('email', { message: getErrorMessage(error) })
            return
         }
         form.setError('root.server', { message: getErrorMessage(error) })
      }
   }

   return (
      <form
         onSubmit={form.handleSubmit(onSubmit)}
         noValidate
         className="flex flex-col gap-7"
      >
         <FieldGroup>
            <div className="grid grid-cols-2 gap-3.5">
               <InputField
                  name="firstName"
                  control={form.control}
                  label="NOMBRE"
                  placeholder="Laura"
                  disabled={isSubmitting}
               />
               <InputField
                  name="lastName"
                  control={form.control}
                  label="APELLIDOS"
                  placeholder="Martín"
                  disabled={isSubmitting}
               />
            </div>

            <InputField
               name="email"
               control={form.control}
               label="CORREO ELECTRÓNICO"
               type="email"
               placeholder="tu@email.com"
               disabled={isSubmitting}
            />

            <div className="flex flex-col gap-2">
               <InputField
                  name="password"
                  control={form.control}
                  label="CONTRASEÑA"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  disabled={isSubmitting}
               />
               <PasswordStrengthMeter password={password} />
            </div>

            <InputField
               name="confirmPassword"
               control={form.control}
               label="CONFIRMAR CONTRASEÑA"
               type="password"
               placeholder="Repite la contraseña"
               disabled={isSubmitting}
            />

            {/* TODO(legal): enlazar a las páginas de términos y privacidad
                cuando existan */}
            <CheckboxField
               name="terms"
               control={form.control}
               label="Acepto los términos y condiciones y la política de privacidad."
               disabled={isSubmitting}
            />
         </FieldGroup>

         <div className="flex flex-col gap-4">
            <FormServerError
               message={form.formState.errors.root?.server?.message}
            />
            <SubmitButton
               isLoading={isSubmitting}
               label="Registrarse"
               loadingLabel="Creando cuenta…"
            />
         </div>
      </form>
   )
}

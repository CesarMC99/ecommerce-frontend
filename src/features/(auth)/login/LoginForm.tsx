'use client'

import { CheckboxField } from '@/components/shared/CheckboxField'
import { InputField } from '@/components/shared/InputField'
import { FieldGroup } from '@/components/ui/field'
import { LOGIN } from '@/graphql/modules/auth/mutations/login.mutation'
import { getErrorMessage } from '@/lib/graphql-error'
import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { FormServerError } from '../shared/FormServerError'
import { SubmitButton } from '../shared/SubmitButton'
import { useCompleteAuth } from '../shared/use-complete-auth'
import { loginSchema, type LoginFormValues } from './login.schema'

export const LoginForm = () => {
   const completeAuth = useCompleteAuth()
   // LOGIN es un TypedDocumentNode: useMutation infiere solo los tipos
   // de variables y respuesta generados por Codegen
   const [login] = useMutation(LOGIN)

   const form = useForm<LoginFormValues>({
      // zodResolver: el esquema valida ANTES de llamar a onSubmit.
      // Si algo no cumple, onSubmit ni se ejecuta
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: '',
         remember: false,
      },
   })

   const isSubmitting = form.formState.isSubmitting

   const onSubmit = async ({ email, password }: LoginFormValues) => {
      try {
         const { data } = await login({
            variables: { input: { email: email.trim(), password } },
         })
         if (data) completeAuth(data.login)
      } catch (error) {
         // `root.server`: error del formulario entero, no de un campo.
         // El backend responde "Credenciales inválidas" tanto si el email
         // no existe como si la contraseña falla (no revela qué cuentas hay)
         form.setError('root.server', { message: getErrorMessage(error) })
      }
   }

   return (
      <form
         onSubmit={form.handleSubmit(onSubmit)}
         noValidate
         className="flex flex-col gap-8"
      >
         <FieldGroup>
            <InputField
               name="email"
               control={form.control}
               label="CORREO ELECTRÓNICO"
               type="email"
               placeholder="tu@email.com"
               disabled={isSubmitting}
            />

            <InputField
               name="password"
               control={form.control}
               label="CONTRASEÑA"
               type="password"
               placeholder="••••••••"
               disabled={isSubmitting}
            />

            <div className="flex justify-between items-center">
               {/* TODO(backend): "Recordarme" aún no cambia nada. El backend
                   emite siempre una sesión de 7 días; habría que enviar este
                   valor y que el backend acorte la cookie si viene en false */}
               <CheckboxField
                  name="remember"
                  control={form.control}
                  label="Recordarme"
                  disabled={isSubmitting}
               />

               {/* TODO(backend): no existe aún el flujo de recuperar contraseña */}
               <Link
                  href={'#'}
                  className="text-coral-principal text-[13px]"
               >
                  ¿Olvidaste tu contraseña?
               </Link>
            </div>
         </FieldGroup>

         <div className="flex flex-col gap-4">
            <FormServerError
               message={form.formState.errors.root?.server?.message}
            />
            <SubmitButton
               isLoading={isSubmitting}
               label="Iniciar sesión"
               loadingLabel="Accediendo…"
            />
         </div>
      </form>
   )
}

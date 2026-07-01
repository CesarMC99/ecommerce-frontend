'use client'

import { CheckboxField } from '@/components/shared/CheckboxField'
import { InputField } from '@/components/shared/InputField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

export const LoginForm = () => {
   const form = useForm({
      defaultValues: {
         email: '',
         password: '',
         remember: false,
      },
   })

   const isSubmitting = form.formState.isSubmitting

   const onSubmit = async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // simula petición
      console.log(data)
   }
   return (
      <form
         onSubmit={form.handleSubmit(onSubmit)}
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
               <CheckboxField
                  name="remember"
                  control={form.control}
                  label="Recordarme"
                  disabled={isSubmitting}
               />

               <Link
                  href={'#'}
                  className="text-coral-principal text-[13px]"
               >
                  ¿Olvidaste tu contraseña?
               </Link>
            </div>
         </FieldGroup>

         <Button
            variant={'primary'}
            type="submit"
            disabled={isSubmitting}
         >
            Iniciar sesión
         </Button>
      </form>
   )
}

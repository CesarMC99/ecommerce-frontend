'use client'

import { useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Button } from '../ui/button'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'

interface InputFieldProps<T extends FieldValues> {
   name: Path<T>
   control: Control<T>
   label: string
   type?: string
   placeholder?: string
   disabled?: boolean
}

export function InputField<T extends FieldValues>({
   name,
   control,
   label,
   type = 'text',
   placeholder,
   disabled,
}: InputFieldProps<T>) {
   const [viewPassword, setViewPassword] = useState<boolean>(false)
   const isPassword = type === 'password'
   return (
      <Controller
         name={name}
         control={control}
         render={({ field, fieldState }) => (
            <Field
               data-invalid={fieldState.invalid}
               data-disabled={disabled}
            >
               <div className="flex justify-between items-center">
                  {label && (
                     <FieldLabel
                        htmlFor={field.name}
                        className="text-xs text-brown-1 tracking-[0.06em] font-normal"
                     >
                        {label}
                     </FieldLabel>
                  )}

                  {type === 'password' && (
                     <Button
                        type="button"
                        onClick={() => setViewPassword((prev) => !prev)}
                        disabled={disabled}
                        className="text-xs text-coral-principal cursor-pointer"
                     >
                        {viewPassword ? 'Ocultar' : 'Mostrar'}
                     </Button>
                  )}
               </div>
               <Input
                  {...field}
                  id={field.name}
                  type={
                     isPassword ? (viewPassword ? 'text' : 'password') : type
                  }
                  aria-invalid={fieldState.invalid}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="bg-white text-sm rounded-md border border-beige-2 py-3.5 px-4 outline-none transition-all duration-200
                  focus:shadow-[0_0_0_3px_rgba(194,94,58,0.12)] focus-visible:ring-0 "
               />
               {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
               )}
            </Field>
         )}
      />
   )
}

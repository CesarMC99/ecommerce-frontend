'use client'

import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Checkbox } from '../ui/checkbox'
import {
   Field,
   FieldContent,
   FieldDescription,
   FieldError,
   FieldLabel,
} from '../ui/field'

interface CheckboxFieldProps<T extends FieldValues> {
   name: Path<T>
   control: Control<T>
   label?: string
   description?: string
   disabled?: boolean
}

export function CheckboxField<T extends FieldValues>({
   name,
   control,
   label,
   description,
   disabled,
}: CheckboxFieldProps<T>) {
   return (
      <Controller
         name={name}
         control={control}
         render={({ field, fieldState }) => (
            <Field
               orientation="horizontal"
               data-invalid={fieldState.invalid}
               data-disabled={disabled}
               className="has-[>[data-slot=field-content]]:[&>[role=checkbox],&>[role=radio]]:mt-0 w-fit"
            >
               <Checkbox
                  id={`${name}-checkbox`}
                  name={field.name}
                  ref={field.ref}
                  disabled={disabled}
                  aria-invalid={fieldState.invalid}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                     field.onChange(checked)
                     field.onBlur()
                  }}
                  className="size-[18px] border border-[#e2cdbf] text-white cursor-pointer
                            data-checked:bg-coral-principal data-checked:border-coral-principal"
               />
               {(label || description || fieldState.error) && (
                  <FieldContent>
                     {label && (
                        <FieldLabel
                           htmlFor={`${name}-checkbox`}
                           className="text-[13px] text-brown-2"
                        >
                           {label}
                        </FieldLabel>
                     )}
                     {description && (
                        <FieldDescription>{description}</FieldDescription>
                     )}
                     {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </FieldContent>
               )}
            </Field>
         )}
      />
   )
}

import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '../register/register.schema'

export const requestResetSchema = z.object({
   email: z.email('Introduce un correo válido'),
})
export type RequestResetFormValues = z.infer<typeof requestResetSchema>

// Mismas reglas que el registro y el perfil (y que ResetPasswordInput)
export const resetPasswordSchema = z
   .object({
      newPassword: z
         .string()
         .min(PASSWORD_MIN_LENGTH, `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`)
         .max(72, 'Máximo 72 caracteres'),
      confirmPassword: z.string().min(1, 'Repite la contraseña'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
   })
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

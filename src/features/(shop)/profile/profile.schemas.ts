import { z } from 'zod'
import { PASSWORD_MIN_LENGTH } from '../../(auth)/register/register.schema'

// Mismas reglas que los inputs del backend (UpdateProfileInput y
// ChangePasswordInput): aviso inmediato aquí, pero manda el servidor

export const profileSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, 'Introduce tu nombre')
      .max(100, 'Máximo 100 caracteres'),
})
export type ProfileFormValues = z.infer<typeof profileSchema>

export const changePasswordSchema = z
   .object({
      currentPassword: z.string().min(1, 'Introduce tu contraseña actual'),
      newPassword: z
         .string()
         .min(PASSWORD_MIN_LENGTH, `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`)
         .max(72, 'Máximo 72 caracteres'),
      confirmPassword: z.string().min(1, 'Repite la nueva contraseña'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
   })
   .refine((data) => data.newPassword !== data.currentPassword, {
      message: 'La nueva contraseña debe ser distinta de la actual',
      path: ['newPassword'],
   })
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

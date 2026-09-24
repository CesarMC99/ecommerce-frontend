import { z } from 'zod'

// Las reglas de la contraseña REFLEJAN las del backend (RegisterInput):
// validar igual en los dos lados da feedback inmediato al usuario, pero la
// validación que manda es SIEMPRE la del servidor (el front se puede saltar)
export const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 72 // límite de bcrypt en el backend

export const registerSchema = z
   .object({
      firstName: z.string().trim().min(1, 'Introduce tu nombre'),
      lastName: z.string().trim().min(1, 'Introduce tus apellidos'),
      email: z.email('Introduce un correo válido'),
      password: z
         .string()
         .min(
            PASSWORD_MIN_LENGTH,
            `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`,
         )
         .max(
            PASSWORD_MAX_LENGTH,
            `Máximo ${PASSWORD_MAX_LENGTH} caracteres`,
         ),
      confirmPassword: z.string().min(1, 'Repite la contraseña'),
      // boolean + refine (y no z.literal(true)): el checkbox EMPIEZA en
      // false, así que su tipo debe admitir false; solo es VÁLIDO en true
      terms: z.boolean().refine((accepted) => accepted, {
         message: 'Debes aceptar los términos para continuar',
      }),
   })
   // Regla que involucra DOS campos: va en el objeto, no en un campo.
   // `path` indica bajo qué campo se muestra el error
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
   })

export type RegisterFormValues = z.infer<typeof registerSchema>

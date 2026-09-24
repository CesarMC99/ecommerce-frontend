import { z } from 'zod'

// El esquema vive en su propio archivo (y no dentro del formulario) para
// que la regla de validación se pueda leer, reutilizar y testear sin React
export const loginSchema = z.object({
   email: z.email('Introduce un correo válido'),
   // En el login NO se exige longitud mínima: si la contraseña es corta,
   // simplemente será incorrecta. Exigirla aquí daría pistas a un atacante
   password: z.string().min(1, 'Introduce tu contraseña'),
   remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

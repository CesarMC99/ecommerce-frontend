import { isValidPhoneNumber, type CountryCode } from 'libphonenumber-js'
import { z } from 'zod'

// Mismas reglas que CheckoutInput del backend. Se repiten aquí para avisar
// al instante (sin viajar al servidor), pero la validación que MANDA es la
// del backend: el navegador se puede saltar
const required = (message: string, max: number) =>
   z
      .string()
      .trim()
      .min(1, message)
      .max(max, `Máximo ${max} caracteres`)

export const checkoutSchema = z
   .object({
      email: z.email('Introduce un correo válido'),
      fullName: required('Indica el nombre completo', 100),
      country: z.string().length(2, 'Elige un país'),
      city: z.string().min(1, 'Elige una ciudad de la lista'),
      line1: required('Indica la dirección', 150),
      // Solo cifras y espacios (el campo ya no deja escribir otra cosa)
      phone: z
         .string()
         .trim()
         .min(1, 'Indica un teléfono')
         .regex(/^[\d\s]+$/, 'El teléfono solo admite números'),
   })
   // El teléfono depende del país: "612 345 678" vale en España pero no en
   // México. superRefine permite validar un campo mirando otro
   .superRefine((values, ctx) => {
      if (!values.country || !/^[\d\s]+$/.test(values.phone)) return
      if (!isValidPhoneNumber(values.phone, values.country as CountryCode)) {
         ctx.addIssue({
            code: 'custom',
            path: ['phone'],
            message: 'El teléfono no es válido para el país elegido',
         })
      }
   })

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

/** País preseleccionado: el de la tienda */
export const DEFAULT_COUNTRY = 'ES'

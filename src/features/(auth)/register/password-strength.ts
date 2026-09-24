import { PASSWORD_MIN_LENGTH } from './register.schema'

export type PasswordStrength = 0 | 1 | 2 | 3 | 4

// Suma un punto por cada criterio cumplido (misma regla que el diseño).
// Es una función PURA (sin React): fácil de entender y de testear aislada
export function getPasswordStrength(password: string): PasswordStrength {
   const criteria = [
      password.length >= PASSWORD_MIN_LENGTH,
      /[A-Z]/.test(password), // una mayúscula
      /[0-9]/.test(password), // un número
      /[^A-Za-z0-9]/.test(password), // un símbolo
   ]
   return criteria.filter(Boolean).length as PasswordStrength
}

// Índice = nivel de seguridad. El 0 no se muestra (campo vacío)
export const STRENGTH_LABELS = ['', 'Débil', 'Aceptable', 'Buena', 'Fuerte']
export const STRENGTH_COLORS = [
   '#e2cdbf',
   '#c0563a',
   '#d08a3a',
   '#9a9a3a',
   '#5b8a4a',
]

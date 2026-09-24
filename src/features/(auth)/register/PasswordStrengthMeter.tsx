import {
   getPasswordStrength,
   STRENGTH_COLORS,
   STRENGTH_LABELS,
} from './password-strength'

interface PasswordStrengthMeterProps {
   password: string
}

const SEGMENTS = [1, 2, 3, 4]

export function PasswordStrengthMeter({
   password,
}: PasswordStrengthMeterProps) {
   // Con el campo vacío no hay nada que evaluar: no se pinta nada
   if (!password) return null

   const strength = getPasswordStrength(password)
   const color = STRENGTH_COLORS[strength]

   return (
      <div>
         <div className="flex gap-[5px]">
            {SEGMENTS.map((segment) => (
               <span
                  key={segment}
                  className="h-1 flex-1 rounded-sm bg-beige-3 transition-colors"
                  // El color depende de un valor calculado: se usa style
                  // porque Tailwind no puede generar clases en tiempo de ejecución
                  style={
                     segment <= strength ? { backgroundColor: color } : undefined
                  }
               />
            ))}
         </div>
         {/* aria-live: el lector de pantalla anuncia el cambio de nivel mientras se escribe */}
         <p
            aria-live="polite"
            className="mt-1.5 text-xs"
            style={{ color }}
         >
            Seguridad: {STRENGTH_LABELS[strength]}
         </p>
      </div>
   )
}

interface FormServerErrorProps {
   message?: string
}

// Error que devuelve el SERVIDOR y que no pertenece a un campo concreto
// ("Credenciales inválidas", "No pudimos conectar..."). role="alert" hace
// que el lector de pantalla lo anuncie en cuanto aparece
export function FormServerError({ message }: FormServerErrorProps) {
   if (!message) return null

   return (
      <p
         role="alert"
         className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13px] text-destructive"
      >
         {message}
      </p>
   )
}

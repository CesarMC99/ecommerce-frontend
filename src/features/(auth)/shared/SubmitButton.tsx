import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
   isLoading: boolean
   label: string
   loadingLabel: string
}

// Botón de envío con estado de carga. Deshabilitarlo mientras se envía
// evita el doble clic que mandaría DOS peticiones (dos registros, etc.)
export function SubmitButton({
   isLoading,
   label,
   loadingLabel,
}: SubmitButtonProps) {
   return (
      <Button
         variant="primary"
         type="submit"
         disabled={isLoading}
         // aria-busy informa a los lectores de pantalla de que está trabajando
         aria-busy={isLoading}
         className="gap-2.5 hover:bg-coral-4"
      >
         {isLoading && (
            <span
               aria-hidden
               className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
         )}
         {isLoading ? loadingLabel : label}
      </Button>
   )
}

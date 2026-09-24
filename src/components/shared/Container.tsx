import { cn } from '@/lib/utils'

interface ContainerProps extends React.ComponentProps<'div'> {
   children: React.ReactNode
}

// Todas las secciones del diseño comparten el mismo ancho máximo (1280px) y
// los mismos márgenes laterales. Encapsularlo evita que cada sección repita
// "max-w-[1280px] mx-auto px-10" y que alguna se desalinee por un typo
export function Container({ children, className, ...props }: ContainerProps) {
   return (
      <div
         className={cn('mx-auto w-full max-w-[1280px] px-4 md:px-10', className)}
         {...props}
      >
         {children}
      </div>
   )
}

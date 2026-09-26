'use client'

import { cn } from '@/lib/utils'
import { Popover as PopoverPrimitive } from 'radix-ui'
import * as React from 'react'

// Popover de shadcn (sobre Radix): una capa flotante anclada a un botón.
// Radix se encarga de posicionarla (y darle la vuelta si no cabe), cerrarla
// con Escape o clic fuera y devolver el foco al botón al cerrar

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
   return (
      <PopoverPrimitive.Root
         data-slot="popover"
         {...props}
      />
   )
}

function PopoverTrigger(
   props: React.ComponentProps<typeof PopoverPrimitive.Trigger>,
) {
   return (
      <PopoverPrimitive.Trigger
         data-slot="popover-trigger"
         {...props}
      />
   )
}

function PopoverContent({
   className,
   align = 'start',
   sideOffset = 6,
   ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
   return (
      // Portal: se pinta al final del <body>, así ningún overflow:hidden de
      // un contenedor padre lo recorta
      <PopoverPrimitive.Portal>
         <PopoverPrimitive.Content
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            className={cn(
               'z-50 rounded-md border border-beige-2 bg-white shadow-[0_12px_32px_rgba(26,18,13,0.12)] outline-none',
               'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
               'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
               className,
            )}
            {...props}
         />
      </PopoverPrimitive.Portal>
   )
}

export { Popover, PopoverContent, PopoverTrigger }

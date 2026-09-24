'use client'

import { cn } from '@/lib/utils'
import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Select as SelectPrimitive } from 'radix-ui'
import * as React from 'react'

// Select de shadcn (sobre Radix) adaptado a los colores de ÁMBAR.
// Radix aporta lo difícil de un desplegable propio: navegación con teclado
// (flechas, Enter, Escape, escribir para buscar), foco atrapado dentro del
// menú, cierre al hacer clic fuera y roles ARIA para lectores de pantalla.
// Nosotros solo ponemos el estilo.

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
   return (
      <SelectPrimitive.Root
         data-slot="select"
         {...props}
      />
   )
}

function SelectGroup({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
   return (
      <SelectPrimitive.Group
         data-slot="select-group"
         className={cn('p-1', className)}
         {...props}
      />
   )
}

function SelectValue({
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
   return (
      <SelectPrimitive.Value
         data-slot="select-value"
         {...props}
      />
   )
}

function SelectTrigger({
   className,
   children,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
   return (
      <SelectPrimitive.Trigger
         data-slot="select-trigger"
         className={cn(
            // `group`: la flecha gira cuando el menú está abierto
            'group flex h-10 cursor-pointer items-center justify-between gap-2.5 rounded-md border border-beige-2 bg-neutro-1 px-3.5 text-[13px] whitespace-nowrap text-brown-principal transition-all outline-none',
            'hover:border-beige-3',
            // Mismo anillo de foco que los inputs del login (coherencia visual)
            'focus-visible:border-coral-principal focus-visible:shadow-[0_0_0_3px_rgba(255,77,46,0.12)]',
            'data-[state=open]:border-coral-principal data-[state=open]:shadow-[0_0_0_3px_rgba(255,77,46,0.12)]',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'data-placeholder:text-brown-1',
            className,
         )}
         {...props}
      >
         {children}
         <SelectPrimitive.Icon asChild>
            <HugeiconsIcon
               icon={ArrowDown01Icon}
               strokeWidth={2}
               className="size-4 shrink-0 text-brown-1 transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
         </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
   )
}

function SelectContent({
   className,
   children,
   // 'popper': el menú se abre DEBAJO del botón (como un menú normal).
   // El modo por defecto de Radix lo coloca ENCIMA, tapando el botón
   position = 'popper',
   sideOffset = 6,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
   return (
      // Portal: se pinta al final del <body>, así ningún overflow ni z-index
      // de la página lo puede recortar
      <SelectPrimitive.Portal>
         <SelectPrimitive.Content
            data-slot="select-content"
            position={position}
            sideOffset={sideOffset}
            className={cn(
               'relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden rounded-lg border border-beige-2 bg-neutro-1 p-1.5',
               // Sombra cálida (marrón, no gris) a juego con la paleta
               'shadow-[0_12px_32px_-8px_rgba(26,18,13,0.18)]',
               // Animación de apertura/cierre (tw-animate-css)
               'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
               'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
               className,
            )}
            {...props}
         >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
            <SelectScrollDownButton />
         </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
   )
}

function SelectLabel({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
   return (
      <SelectPrimitive.Label
         data-slot="select-label"
         className={cn(
            'px-3 pt-1.5 pb-1 text-[11px] tracking-[0.1em] text-brown-1',
            className,
         )}
         {...props}
      />
   )
}

function SelectItem({
   className,
   children,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
   return (
      <SelectPrimitive.Item
         data-slot="select-item"
         className={cn(
            'relative flex w-full cursor-pointer items-center rounded-md py-2 pr-9 pl-3 text-[13px] text-brown-2 outline-none select-none transition-colors',
            // Resaltado al pasar el ratón O al moverse con las flechas
            'data-highlighted:bg-beige-1 data-highlighted:text-brown-principal',
            // Opción elegida: en coral y con ✓
            'data-[state=checked]:font-helvetica-medium data-[state=checked]:text-coral-principal',
            'data-disabled:pointer-events-none data-disabled:opacity-50',
            className,
         )}
         {...props}
      >
         <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
         <span className="absolute right-3 flex items-center">
            <SelectPrimitive.ItemIndicator>
               <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2.2}
                  className="size-4 text-coral-principal"
               />
            </SelectPrimitive.ItemIndicator>
         </span>
      </SelectPrimitive.Item>
   )
}

function SelectSeparator({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
   return (
      <SelectPrimitive.Separator
         data-slot="select-separator"
         className={cn('-mx-1.5 my-1.5 h-px bg-beige-2', className)}
         {...props}
      />
   )
}

// Flechas que aparecen si hay tantas opciones que el menú necesita scroll
function SelectScrollUpButton({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
   return (
      <SelectPrimitive.ScrollUpButton
         data-slot="select-scroll-up-button"
         className={cn(
            'flex cursor-default items-center justify-center py-1 text-brown-1',
            className,
         )}
         {...props}
      >
         <HugeiconsIcon
            icon={ArrowUp01Icon}
            strokeWidth={2}
            className="size-4"
         />
      </SelectPrimitive.ScrollUpButton>
   )
}

function SelectScrollDownButton({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
   return (
      <SelectPrimitive.ScrollDownButton
         data-slot="select-scroll-down-button"
         className={cn(
            'flex cursor-default items-center justify-center py-1 text-brown-1',
            className,
         )}
         {...props}
      >
         <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="size-4"
         />
      </SelectPrimitive.ScrollDownButton>
   )
}

export {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectScrollDownButton,
   SelectScrollUpButton,
   SelectSeparator,
   SelectTrigger,
   SelectValue,
}

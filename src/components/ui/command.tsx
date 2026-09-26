'use client'

import { cn } from '@/lib/utils'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Command as CommandPrimitive } from 'cmdk'
import * as React from 'react'

// Command de shadcn (sobre cmdk): una lista con buscador y navegación por
// teclado (flechas, Enter). Es la base del combobox: cmdk filtra, resalta
// la opción activa y pone los roles ARIA de "listbox"

function Command({
   className,
   ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
   return (
      <CommandPrimitive
         data-slot="command"
         className={cn('flex flex-col overflow-hidden text-brown-principal', className)}
         {...props}
      />
   )
}

function CommandInput({
   className,
   ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
   return (
      <div className="flex items-center gap-2 border-b border-beige-2 px-3">
         <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="shrink-0 text-brown-1"
            aria-hidden
         />
         <CommandPrimitive.Input
            data-slot="command-input"
            className={cn(
               'h-11 w-full bg-transparent text-sm outline-none placeholder:text-brown-1',
               className,
            )}
            {...props}
         />
      </div>
   )
}

function CommandList({
   className,
   ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
   return (
      <CommandPrimitive.List
         data-slot="command-list"
         className={cn('max-h-[260px] overflow-y-auto overscroll-contain p-1', className)}
         {...props}
      />
   )
}

function CommandEmpty(
   props: React.ComponentProps<typeof CommandPrimitive.Empty>,
) {
   return (
      <CommandPrimitive.Empty
         data-slot="command-empty"
         className="px-3 py-6 text-center text-[13px] text-brown-1"
         {...props}
      />
   )
}

function CommandItem({
   className,
   ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
   return (
      <CommandPrimitive.Item
         data-slot="command-item"
         className={cn(
            'flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm outline-none select-none',
            // data-selected = opción resaltada con teclado o ratón
            'data-[selected=true]:bg-neutro-3 data-[selected=true]:text-coral-principal',
            className,
         )}
         {...props}
      />
   )
}

export { Command, CommandEmpty, CommandInput, CommandItem, CommandList }

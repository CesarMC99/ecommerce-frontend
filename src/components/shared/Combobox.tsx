'use client'

import {
   Command,
   CommandEmpty,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

export interface ComboboxOption {
   value: string
   label: string
   /** Texto secundario a la derecha (p. ej. el prefijo "+34" del país) */
   hint?: string
}

interface ComboboxProps {
   id?: string
   value: string
   onChange: (value: string) => void
   options: ComboboxOption[]
   placeholder: string
   searchPlaceholder: string
   emptyText: string
   disabled?: boolean
   invalid?: boolean
   onBlur?: () => void
   /**
    * Búsqueda en el SERVIDOR: si se pasa, el combobox no filtra por su
    * cuenta; avisa de lo escrito y muestra las opciones que le lleguen
    */
   onSearchChange?: (search: string) => void
   loading?: boolean
}

/**
 * Combobox = desplegable CON buscador. Solo se puede elegir una opción de
 * la lista (no acepta texto libre): así país y ciudad siempre son válidos.
 *
 * Dos modos:
 *  - Local (países): recibe todas las opciones y cmdk las filtra.
 *  - Remoto (ciudades): `onSearchChange` pide al servidor y `options`
 *    trae solo los resultados.
 */
export function Combobox({
   id,
   value,
   onChange,
   options,
   placeholder,
   searchPlaceholder,
   emptyText,
   disabled,
   invalid,
   onBlur,
   onSearchChange,
   loading = false,
}: ComboboxProps) {
   const [open, setOpen] = useState(false)
   const isRemote = onSearchChange !== undefined
   // cmdk identifica cada opción por este texto (ver CommandItem)
   const itemValue = (option: ComboboxOption) => `${option.label} ${option.value}`
   // Opción resaltada con el teclado. En modo remoto los resultados llegan
   // DESPUÉS de escribir y cmdk no resalta ninguno: Enter no haría nada.
   // Si lo resaltado ya no está en la lista, se resalta el primero
   const [highlighted, setHighlighted] = useState('')
   const itemValues = options.map(itemValue)
   const activeItem = itemValues.includes(highlighted)
      ? highlighted
      : (itemValues[0] ?? '')
   const selected = options.find((option) => option.value === value)
   // En modo remoto la opción elegida puede no estar entre los resultados
   // de la última búsqueda: el valor ES el texto (nombre de la ciudad)
   const label = selected?.label ?? (value || null)

   const handleOpenChange = (next: boolean) => {
      setOpen(next)
      // Al cerrar cuenta como "salir del campo": react-hook-form valida
      if (!next) onBlur?.()
   }

   return (
      <Popover
         open={open}
         onOpenChange={handleOpenChange}
      >
         <PopoverTrigger asChild>
            <button
               id={id}
               type="button"
               role="combobox"
               aria-expanded={open}
               aria-invalid={invalid}
               disabled={disabled}
               className={cn(
                  'flex h-[50px] w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-beige-2 bg-white px-4 text-left text-sm transition-all duration-200 outline-none',
                  'focus-visible:shadow-[0_0_0_3px_rgba(194,94,58,0.12)] disabled:cursor-not-allowed disabled:opacity-60',
                  open && 'shadow-[0_0_0_3px_rgba(194,94,58,0.12)]',
                  invalid && 'border-destructive',
               )}
            >
               <span className={cn('truncate', !label && 'text-brown-1')}>
                  {label ?? placeholder}
               </span>
               <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={16}
                  aria-hidden
                  className={cn(
                     'shrink-0 text-brown-1 transition-transform',
                     open && 'rotate-180',
                  )}
               />
            </button>
         </PopoverTrigger>
         {/* Mismo ancho que el botón (variable que pone Radix) */}
         <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command
               shouldFilter={!isRemote}
               // En modo local cmdk filtra y resalta solo; en remoto lo
               // controlamos nosotros (ver activeItem)
               {...(isRemote && { value: activeItem, onValueChange: setHighlighted })}
            >
               <CommandInput
                  placeholder={searchPlaceholder}
                  onValueChange={onSearchChange}
               />
               <CommandList>
                  {/* Mientras busca se siguen viendo los resultados
                      anteriores; "Buscando…" solo si aún no hay ninguno */}
                  {loading && options.length === 0 ? (
                     <div
                        role="status"
                        className="px-3 py-6 text-center text-[13px] text-brown-1"
                     >
                        Buscando…
                     </div>
                  ) : (
                     <CommandEmpty>{emptyText}</CommandEmpty>
                  )}
                  {options.map((option) => (
                     <CommandItem
                        key={option.value}
                        // cmdk filtra por `value`: se le da el texto visible
                        // (buscar "alem" encuentra Alemania, no "DE")
                        value={itemValue(option)}
                        onSelect={() => {
                           onChange(option.value)
                           handleOpenChange(false)
                        }}
                     >
                        <span className="flex-1 truncate">{option.label}</span>
                        {option.hint && (
                           <span className="text-xs text-brown-1">{option.hint}</span>
                        )}
                        {option.value === value && (
                           <HugeiconsIcon
                              icon={Tick02Icon}
                              size={16}
                              aria-hidden
                              className="text-coral-principal"
                           />
                        )}
                     </CommandItem>
                  ))}
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

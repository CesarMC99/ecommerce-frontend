'use client'

import {
   Command,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { SEARCH_SUGGESTIONS } from '@/graphql/modules/products/queries/search.query'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { formatPrice } from '@/lib/format-price'
import { catalogRoute, productRoute } from '@/lib/routes'
import { useQuery } from '@apollo/client/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { CloudinaryImage } from './CloudinaryImage'
import { NAV_LINKS } from './nav-links'
import { SpriteIcon } from './SpriteIcon'

/** Sugerencias de producto mientras se escribe. */
const SUGGESTIONS_LIMIT = 5
/** Por debajo de esto no se pregunta al servidor ("a" encontraría casi todo). */
const MIN_SEARCH_LENGTH = 2

// Buscador del header: la lupa abre un panel con un campo de texto y
// sugerencias mientras se escribe. Es un Dialog de Radix (foco atrapado,
// Escape para cerrar) con una lista de cmdk dentro: ↑ ↓ para moverse y
// Enter para abrir, sin programar la navegación por teclado a mano
export function SearchDialog() {
   const [open, setOpen] = useState(false)
   const [text, setText] = useState('')
   const router = useRouter()

   const search = text.trim()
   // Debounce: una petición cuando se deja de teclear, no una por tecla
   const debouncedSearch = useDebouncedValue(search)
   const canSearch = debouncedSearch.length >= MIN_SEARCH_LENGTH

   const { data, previousData, loading } = useQuery(SEARCH_SUGGESTIONS, {
      variables: { search: debouncedSearch, limit: SUGGESTIONS_LIMIT },
      skip: !canSearch,
   })
   // previousData: mientras llega la nueva respuesta se siguen viendo las
   // sugerencias anteriores en vez de una lista que parpadea
   const result = canSearch ? (data ?? previousData)?.products : undefined
   const isTyping = search !== debouncedSearch

   const handleOpenChange = (next: boolean) => {
      setOpen(next)
      // Al cerrar se limpia: la próxima vez empieza en blanco
      if (!next) setText('')
   }

   const go = (href: string) => {
      handleOpenChange(false)
      router.push(href)
   }

   return (
      <Dialog.Root
         open={open}
         onOpenChange={handleOpenChange}
      >
         <Dialog.Trigger
            aria-label="Buscar"
            className="cursor-pointer transition-opacity hover:opacity-70"
         >
            <SpriteIcon
               name="search-normal"
               className="size-[19px]"
            />
         </Dialog.Trigger>

         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-brown-principal/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            {/* Panel arriba (donde se mira al buscar), no centrado */}
            <Dialog.Content className="fixed inset-x-3 top-3 z-50 mx-auto max-w-[640px] overflow-hidden rounded-md bg-white shadow-[0_20px_60px_rgba(26,18,13,0.25)] duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 sm:top-20">
               <Dialog.Title className="sr-only">Buscar en la tienda</Dialog.Title>
               <Dialog.Description className="sr-only">
                  Escribe para ver sugerencias; pulsa Enter para ver todos los
                  resultados
               </Dialog.Description>

               {/* shouldFilter={false}: el filtrado lo hace el servidor */}
               <Command
                  shouldFilter={false}
                  loop
               >
                  <CommandInput
                     value={text}
                     onValueChange={setText}
                     placeholder="Busca abrigos, lino, cuero…"
                     maxLength={60}
                     className="h-14 text-base"
                  />
                  <CommandList className="max-h-[min(460px,70vh)]">
                     {search.length === 0 ? (
                        // Aún no ha escrito: atajos a las secciones
                        <div className="px-4 py-4">
                           <p className="mb-3 text-[11px] tracking-[0.1em] text-brown-1">
                              EXPLORA
                           </p>
                           <div className="flex flex-wrap gap-2">
                              {NAV_LINKS.map((link) => (
                                 <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => handleOpenChange(false)}
                                    className="rounded-full border border-beige-2 px-3.5 py-1.5 text-[13px] text-brown-2 hover:border-brown-1"
                                 >
                                    {link.label}
                                 </Link>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <>
                           {/* Siempre la primera: Enter = ver todos los
                               resultados en el catálogo */}
                           <CommandItem
                              value="__buscar__"
                              onSelect={() => go(catalogRoute({ q: search }))}
                              className="gap-3 py-3"
                           >
                              <SpriteIcon
                                 name="search-normal"
                                 className="size-4 shrink-0 text-brown-1"
                              />
                              <span className="flex-1 truncate">
                                 Buscar «{search}» en el catálogo
                              </span>
                              {result && (
                                 <span className="text-xs text-brown-1">
                                    {result.totalCount}{' '}
                                    {result.totalCount === 1 ? 'resultado' : 'resultados'}
                                 </span>
                              )}
                           </CommandItem>

                           {result?.items.map((product) => (
                              <CommandItem
                                 key={product.id}
                                 value={product.id}
                                 onSelect={() => go(productRoute(product.slug))}
                                 className="gap-3"
                              >
                                 <div className="w-10 shrink-0">
                                    <CloudinaryImage
                                       image={product.mainImage}
                                       className="aspect-[4/5] rounded-sm"
                                       autoCrop="4:5"
                                       sizes="40px"
                                    />
                                 </div>
                                 <span className="flex-1 truncate text-brown-principal">
                                    {product.name}
                                 </span>
                                 <span className="text-[13px] text-brown-2">
                                    {formatPrice(product.price)}
                                 </span>
                              </CommandItem>
                           ))}

                           {search.length < MIN_SEARCH_LENGTH ? (
                              <p className="px-4 py-3 text-[13px] text-brown-1">
                                 Sigue escribiendo…
                              </p>
                           ) : (loading || isTyping) && !result ? (
                              <p
                                 role="status"
                                 className="px-4 py-3 text-[13px] text-brown-1"
                              >
                                 Buscando…
                              </p>
                           ) : result?.totalCount === 0 && !isTyping ? (
                              <p className="px-4 py-3 text-[13px] text-brown-1">
                                 No encontramos productos para «{search}».
                                 Prueba con otra palabra.
                              </p>
                           ) : null}
                        </>
                     )}
                  </CommandList>
               </Command>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

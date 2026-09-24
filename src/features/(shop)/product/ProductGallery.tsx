'use client'
// Client Component: recuerda qué foto está seleccionada

import {
   CloudinaryImage,
   type CloudinaryImageData,
} from '@/components/shared/CloudinaryImage'
import { cn } from '@/lib/utils'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

interface ProductGalleryProps {
   images: CloudinaryImageData[]
   productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
   const [selectedIndex, setSelectedIndex] = useState(0)
   // Sin fotos se muestra el placeholder (CloudinaryImage lo gestiona con null)
   const selectedImage = images[selectedIndex] ?? null
   const hasMultipleImages = images.length > 1

   // Navegación CIRCULAR: desde la última, "siguiente" vuelve a la primera
   // (y al revés). El módulo (%) hace el "dar la vuelta"; el `+ total`
   // evita un índice negativo al retroceder desde la primera foto
   const showImage = (step: 1 | -1) =>
      setSelectedIndex(
         (current) => (current + step + images.length) % images.length,
      )

   // Flechas del teclado cuando el foco está dentro de la galería
   // (p. ej. tras pulsar una flecha o una miniatura con Tab)
   const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!hasMultipleImages) return
      if (event.key === 'ArrowRight') showImage(1)
      if (event.key === 'ArrowLeft') showImage(-1)
   }

   return (
      <div onKeyDown={handleKeyDown}>
         {/* Dos grupos con nombre: `gallery` (todo el marco) muestra las
             flechas; `photo` (solo la foto) activa el zoom. Así, al poner el
             ratón sobre una flecha, la foto deja de ampliarse y no "baila"
             mientras navegas */}
         <div className="group/gallery relative overflow-hidden rounded">
            <div className="group/photo">
               <CloudinaryImage
                  image={selectedImage}
                  className="aspect-3/4 cursor-zoom-in transition-transform duration-500 ease-out group-hover/photo:scale-[1.18]"
                  autoCrop="3:4"
                  // Algo más de media pantalla en escritorio (máx. ~640 px)
                  sizes="(min-width: 1280px) 640px, (min-width: 768px) 55vw, 100vw"
                  // Es lo principal de la página: se carga con prioridad
                  priority
               />
            </div>

            {hasMultipleImages && (
               <>
                  <GalleryArrow
                     direction="previous"
                     onClick={() => showImage(-1)}
                  />
                  <GalleryArrow
                     direction="next"
                     onClick={() => showImage(1)}
                  />
                  {/* Contador "2 / 3": dice cuántas fotos hay sin tener que
                      bajar a las miniaturas. aria-live anuncia el cambio */}
                  <span
                     aria-live="polite"
                     className="absolute right-3 bottom-3 rounded-full bg-brown-principal/60 px-2.5 py-1 text-[11px] tracking-[0.04em] text-neutro-3 backdrop-blur-sm"
                  >
                     {selectedIndex + 1} / {images.length}
                  </span>
               </>
            )}
         </div>

         {/* Con una sola foto, las miniaturas no aportan nada */}
         {images.length > 1 && (
            <ul className="mt-3 grid grid-cols-4 gap-3">
               {images.map((image, index) => {
                  const isSelected = index === selectedIndex
                  return (
                     <li key={image.publicId}>
                        <button
                           type="button"
                           onClick={() => setSelectedIndex(index)}
                           aria-label={`Ver foto ${index + 1} de ${images.length} de ${productName}`}
                           // aria-pressed: el lector anuncia cuál está activa
                           aria-pressed={isSelected}
                           className={cn(
                              'block w-full cursor-pointer overflow-hidden rounded-[3px] transition-opacity',
                              isSelected
                                 ? 'ring-2 ring-brown-principal ring-offset-2 ring-offset-neutro-2'
                                 : 'opacity-70 hover:opacity-100',
                           )}
                        >
                           <CloudinaryImage
                              image={image}
                              className="aspect-square rounded-none"
                              autoCrop="1:1"
                              // Miniatura: ~150 px en escritorio
                              sizes="(min-width: 768px) 150px, 25vw"
                           />
                        </button>
                     </li>
                  )
               })}
            </ul>
         )}
      </div>
   )
}

interface GalleryArrowProps {
   direction: 'previous' | 'next'
   onClick: () => void
}

// Flecha para pasar de foto. Extraída porque izquierda y derecha son
// idénticas salvo el icono, la posición y el texto para lectores de pantalla
function GalleryArrow({ direction, onClick }: GalleryArrowProps) {
   const isNext = direction === 'next'

   return (
      <button
         type="button"
         onClick={onClick}
         aria-label={isNext ? 'Foto siguiente' : 'Foto anterior'}
         className={cn(
            'absolute top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutro-1/85 text-brown-principal shadow-[0_4px_14px_rgba(26,18,13,0.15)] backdrop-blur-sm transition-all duration-200',
            'hover:scale-105 hover:bg-neutro-1',
            isNext ? 'right-3' : 'left-3',
            // En escritorio aparecen al pasar el ratón por la galería.
            // `focus-visible`: también al llegar con el tabulador.
            // `[@media(hover:none)]`: en móviles (sin ratón, no existe el
            // hover) se ven siempre, si no serían imposibles de descubrir
            'opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100',
         )}
      >
         <HugeiconsIcon
            icon={isNext ? ArrowRight01Icon : ArrowLeft01Icon}
            strokeWidth={2}
            className="size-5"
         />
      </button>
   )
}

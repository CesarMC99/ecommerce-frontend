'use client'

import { Dialog } from 'radix-ui'

export type SizeGuideKind = 'clothing' | 'shoes'

// Medidas de referencia en cm. Son datos fijos de la tienda (no cambian por
// producto), así que viven aquí y no en la base de datos
const CLOTHING_ROWS = [
   { size: 'XS', chest: '80–84', waist: '62–66', hip: '86–90' },
   { size: 'S', chest: '84–88', waist: '66–70', hip: '90–94' },
   { size: 'M', chest: '88–92', waist: '70–74', hip: '94–98' },
   { size: 'L', chest: '92–98', waist: '74–80', hip: '98–104' },
   { size: 'XL', chest: '98–104', waist: '80–86', hip: '104–110' },
]

const SHOE_ROWS = [
   { size: '37', length: '23,5' },
   { size: '38', length: '24,0' },
   { size: '39', length: '24,7' },
   { size: '40', length: '25,4' },
   { size: '41', length: '26,0' },
]

interface SizeGuideDialogProps {
   kind: SizeGuideKind
}

// Modal con Radix Dialog. Radix resuelve lo difícil de un modal accesible:
// foco atrapado dentro, cierre con Escape y clic fuera, scroll del fondo
// bloqueado y devolver el foco al botón que lo abrió al cerrarse
export function SizeGuideDialog({ kind }: SizeGuideDialogProps) {
   return (
      <Dialog.Root>
         <Dialog.Trigger className="cursor-pointer text-xs text-coral-principal underline underline-offset-2 hover:text-coral-4">
            Guía de tallas
         </Dialog.Trigger>

         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-brown-principal/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutro-2 p-8 shadow-[0_20px_60px_rgba(26,18,13,0.25)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
               {/* Title y Description son OBLIGATORIOS para la accesibilidad:
                   el lector de pantalla los anuncia al abrir el modal */}
               <Dialog.Title className="font-bricolage-semibold text-[22px] text-brown-principal">
                  Guía de tallas
               </Dialog.Title>
               <Dialog.Description className="mt-2 text-sm leading-relaxed text-brown-1">
                  {kind === 'clothing'
                     ? 'Medidas del cuerpo en centímetros. Si estás entre dos tallas, elige la mayor para un ajuste más holgado.'
                     : 'Largo del pie en centímetros, medido desde el talón hasta el dedo más largo.'}
               </Dialog.Description>

               <table className="mt-6 w-full text-left text-sm">
                  <thead className="border-b border-beige-2 text-xs tracking-[0.08em] text-brown-1">
                     {kind === 'clothing' ? (
                        <tr>
                           <th className="pb-2 font-normal">TALLA</th>
                           <th className="pb-2 font-normal">PECHO</th>
                           <th className="pb-2 font-normal">CINTURA</th>
                           <th className="pb-2 font-normal">CADERA</th>
                        </tr>
                     ) : (
                        <tr>
                           <th className="pb-2 font-normal">TALLA</th>
                           <th className="pb-2 font-normal">LARGO DEL PIE</th>
                        </tr>
                     )}
                  </thead>
                  <tbody className="text-brown-2">
                     {kind === 'clothing'
                        ? CLOTHING_ROWS.map((row) => (
                             <tr
                                key={row.size}
                                className="border-b border-beige-2/60"
                             >
                                <td className="py-2.5 font-helvetica-medium text-brown-principal">
                                   {row.size}
                                </td>
                                <td className="py-2.5">{row.chest}</td>
                                <td className="py-2.5">{row.waist}</td>
                                <td className="py-2.5">{row.hip}</td>
                             </tr>
                          ))
                        : SHOE_ROWS.map((row) => (
                             <tr
                                key={row.size}
                                className="border-b border-beige-2/60"
                             >
                                <td className="py-2.5 font-helvetica-medium text-brown-principal">
                                   {row.size}
                                </td>
                                <td className="py-2.5">{row.length} cm</td>
                             </tr>
                          ))}
                  </tbody>
               </table>

               <Dialog.Close className="mt-7 w-full cursor-pointer bg-brown-principal py-3 text-[13px] text-neutro-2 transition-colors hover:bg-brown-2">
                  Entendido
               </Dialog.Close>
               {/* Botón × en la esquina: otra forma evidente de cerrar */}
               <Dialog.Close
                  aria-label="Cerrar guía de tallas"
                  className="absolute top-4 right-4 cursor-pointer text-2xl leading-none text-brown-1 hover:text-brown-principal"
               >
                  ×
               </Dialog.Close>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

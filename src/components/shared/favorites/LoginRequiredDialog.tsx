'use client'

import { loginRoute, registerRoute } from '@/lib/routes'
import {
   PENDING_FAVORITE_KEY,
   useLoginPromptStore,
} from '@/stores/login-prompt-store'
import { useRouter } from 'next/navigation'
import { Dialog } from 'radix-ui'
import { SpriteIcon } from '../SpriteIcon'

/**
 * Modal "inicia sesión para guardar favoritos". Uno para toda la tienda
 * (vive en el layout); lo abre cualquier corazón pulsado sin sesión.
 *
 * Antes de ir al login se recuerdan dos cosas, para que el usuario no
 * tenga que repetir nada al volver:
 *  - QUÉ quería guardar (sessionStorage) → se guarda solo tras entrar
 *  - DÓNDE estaba (?redirigir=) → vuelve a esa misma página
 */
export function LoginRequiredDialog() {
   const pendingProductId = useLoginPromptStore((state) => state.pendingProductId)
   const closeLoginPrompt = useLoginPromptStore((state) => state.closeLoginPrompt)
   const router = useRouter()

   const goToAuth = (buildRoute: (redirectTo: string) => string) => {
      if (pendingProductId) {
         try {
            sessionStorage.setItem(PENDING_FAVORITE_KEY, pendingProductId)
         } catch {
            // Navegación privada estricta puede bloquear sessionStorage:
            // se pierde el "guardado automático", pero el login funciona
         }
      }
      closeLoginPrompt()
      // La página actual CON sus filtros (/catalogo?categoria=mujer). Se
      // lee de window.location al hacer clic y no con useSearchParams: ese
      // hook en un layout obliga a envolver cada página en <Suspense>
      const currentPath = window.location.pathname + window.location.search
      router.push(buildRoute(currentPath))
   }

   return (
      <Dialog.Root
         open={pendingProductId !== null}
         onOpenChange={(open) => {
            if (!open) closeLoginPrompt()
         }}
      >
         <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-brown-principal/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutro-2 p-8 text-center shadow-[0_20px_60px_rgba(26,18,13,0.25)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
               <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-beige-1">
                  <SpriteIcon
                     name="heart"
                     className="size-6 text-coral-principal"
                  />
               </div>
               <Dialog.Title className="font-bricolage-semibold text-[22px] text-brown-principal">
                  Inicia sesión para guardar favoritos
               </Dialog.Title>
               <Dialog.Description className="mt-2 text-sm leading-relaxed text-brown-1">
                  Tus favoritos se guardan en tu cuenta para que los tengas en
                  cualquier dispositivo. Al volver, este producto se guardará
                  automáticamente.
               </Dialog.Description>

               <div className="mt-7 flex flex-col gap-2.5">
                  <button
                     type="button"
                     onClick={() => goToAuth(loginRoute)}
                     className="cursor-pointer bg-coral-principal py-3.5 text-sm font-helvetica-medium text-white transition-colors hover:bg-coral-4"
                  >
                     Iniciar sesión
                  </button>
                  <button
                     type="button"
                     onClick={() => goToAuth(registerRoute)}
                     className="cursor-pointer border border-brown-principal py-3.5 text-sm font-helvetica-medium text-brown-principal transition-colors hover:bg-brown-principal hover:text-neutro-2"
                  >
                     Crear cuenta
                  </button>
                  <Dialog.Close className="mt-1 cursor-pointer py-2 text-[13px] text-brown-1 hover:text-brown-principal">
                     Ahora no
                  </Dialog.Close>
               </div>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}

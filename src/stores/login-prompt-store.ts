import { create } from 'zustand'

// Clave de sessionStorage con el producto que el invitado quería guardar.
// sessionStorage (y no localStorage): solo tiene sentido durante ESTA
// visita; si cierra la pestaña sin iniciar sesión, se olvida solo
export const PENDING_FAVORITE_KEY = 'ambar-pending-favorite'

interface LoginPromptState {
   /** Producto que se intentó guardar; null = modal cerrado */
   pendingProductId: string | null
   openLoginPrompt: (productId: string) => void
   closeLoginPrompt: () => void
}

// Estado del modal "inicia sesión para guardar favoritos". Vive en un
// store y no en cada corazón: el modal es UNO para toda la tienda (en el
// layout) y cualquier corazón puede abrirlo
export const useLoginPromptStore = create<LoginPromptState>()((set) => ({
   pendingProductId: null,
   openLoginPrompt: (productId) => set({ pendingProductId: productId }),
   closeLoginPrompt: () => set({ pendingProductId: null }),
}))

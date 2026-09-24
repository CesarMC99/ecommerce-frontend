import { CartDrawer } from '@/components/shared/cart/CartDrawer'
import { Footer } from '@/components/shared/Footer'
import { Header } from '@/components/shared/Header'

// Layout del grupo (shop): todas las páginas de la tienda (home, catálogo,
// producto, carrito) comparten header y footer. Al ponerlos aquí se escriben
// UNA vez y, al navegar entre esas páginas, Next.js no los vuelve a renderizar.
// El paréntesis del nombre hace que "(shop)" NO aparezca en la URL.
export default function ShopLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <>
         <Header />
         <main className="animate-fade-in">{children}</main>
         <Footer />
         {/* El drawer vive en el layout (no en cada página): se puede abrir
             desde cualquier parte de la tienda y no se desmonta al navegar */}
         <CartDrawer />
      </>
   )
}

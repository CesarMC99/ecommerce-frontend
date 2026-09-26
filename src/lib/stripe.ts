import { loadStripe, type Stripe } from '@stripe/stripe-js'

// Clave PUBLICABLE (pk_test_... / pk_live_...): solo sirve para mostrar el
// formulario de pago y confirmar cobros que ya creó el backend. No puede
// crear cobros ni leer datos, por eso puede vivir en el navegador. La clave
// SECRETA (sk_...) solo existe en el backend
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Carga Stripe.js UNA sola vez para toda la app.
 *
 * loadStripe inyecta el script de Stripe (js.stripe.com); llamarlo en cada
 * render lo cargaría una y otra vez. Guardar la promesa en el módulo hace
 * que todas las páginas compartan la misma instancia.
 * Se carga desde los servidores de Stripe (no se empaqueta) por seguridad
 * y cumplimiento PCI: así los datos de tarjeta nunca tocan nuestro código.
 */
export function getStripe(): Promise<Stripe | null> {
   if (!PUBLISHABLE_KEY) {
      console.error('[stripe] Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en .env')
      return Promise.resolve(null)
   }
   stripePromise ??= loadStripe(PUBLISHABLE_KEY)
   return stripePromise
}

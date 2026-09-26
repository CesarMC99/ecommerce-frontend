import type { Appearance } from '@stripe/stripe-js'

// El formulario de tarjeta vive DENTRO de un iframe de Stripe (por
// seguridad, nuestro código no puede leer el número de tarjeta). Por eso
// no le llegan nuestras clases de Tailwind: se viste con esta "Appearance
// API", copiando los colores de globals.css
export const STRIPE_APPEARANCE: Appearance = {
   theme: 'stripe',
   variables: {
      colorPrimary: '#ff4d2e', // coral-principal
      colorText: '#1a120d', // brown-principal
      colorTextSecondary: '#8a7a70', // brown-1
      colorTextPlaceholder: '#8a7a70',
      colorBackground: '#ffffff',
      colorDanger: '#b05a4a', // destructive
      colorSuccess: '#5b8a4a',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSizeBase: '14px',
      borderRadius: '6px',
      spacingUnit: '4px',
   },
   rules: {
      // Mismo aspecto que InputField: borde beige y halo coral al enfocar
      '.Input': {
         border: '1px solid #f1e3d9',
         boxShadow: 'none',
         padding: '13px 16px',
      },
      '.Input:focus': {
         border: '1px solid #f1e3d9',
         boxShadow: '0 0 0 3px rgba(194, 94, 58, 0.12)',
      },
      '.Label': {
         fontSize: '12px',
         letterSpacing: '0.06em',
         textTransform: 'uppercase',
         color: '#8a7a70',
      },
      '.Tab': { border: '1px solid #f1e3d9', boxShadow: 'none' },
      '.Tab--selected': { border: '1px solid #ff4d2e' },
   },
}

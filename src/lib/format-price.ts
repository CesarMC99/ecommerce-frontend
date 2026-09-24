// Se crea UNA sola vez a nivel de módulo: construir un Intl.NumberFormat es
// relativamente caro y reutilizarlo en cada tarjeta es gratis
const eurFormatter = new Intl.NumberFormat('es-ES', {
   style: 'currency',
   currency: 'EUR',
   // Los precios del diseño son enteros ("189 €"); si llega un precio con
   // céntimos (59,95) se muestran igualmente
   minimumFractionDigits: 0,
   maximumFractionDigits: 2,
})

export const formatPrice = (amount: number) => eurFormatter.format(amount)

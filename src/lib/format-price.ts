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

// El backend envía los precios en CÉNTIMOS enteros (18900) para evitar los
// errores de redondeo de los decimales. La conversión a euros se hace SOLO
// aquí, en el último momento, justo antes de mostrarlo
export const formatPrice = (cents: number) => eurFormatter.format(cents / 100)

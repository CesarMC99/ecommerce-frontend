// ⚠️ DATOS TEMPORALES
// El backend todavía no tiene módulo de productos. Mientras tanto, la UI se
// construye contra estos datos (copiados del diseño de Claude Design).
// Cuando exista la query GraphQL, este archivo se BORRA y los componentes
// pasan a usar los tipos generados por Codegen, no este `Product` manual.

import type { CatalogCategory } from '@/lib/routes'

export interface Product {
   id: number
   name: string
   price: number
   // Precio anterior: solo existe si el producto está rebajado
   oldPrice?: number
   category: CatalogCategory
   type: string
   color: string
   rating: number
   reviews: number
   // Etiqueta sobre la foto: "-20%", "Nuevo"...
   tag?: string
}

export const MOCK_PRODUCTS: Product[] = [
   { id: 1, name: 'Abrigo de lana', price: 189, oldPrice: 240, category: 'mujer', type: 'Abrigos', color: 'Camel', rating: 4.8, reviews: 128, tag: '-20%' },
   { id: 2, name: 'Camisa de lino', price: 59, category: 'mujer', type: 'Camisas', color: 'Crudo', rating: 4.6, reviews: 64 },
   { id: 3, name: 'Pantalón sastre', price: 89, category: 'hombre', type: 'Pantalones', color: 'Tierra', rating: 4.7, reviews: 90 },
   { id: 4, name: 'Jersey de punto', price: 75, category: 'mujer', type: 'Punto', color: 'Terracota', rating: 4.9, reviews: 201, tag: 'Nuevo' },
   { id: 5, name: 'Vestido midi', price: 119, category: 'mujer', type: 'Vestidos', color: 'Arena', rating: 4.5, reviews: 47 },
   { id: 6, name: 'Gabardina clásica', price: 159, oldPrice: 199, category: 'hombre', type: 'Abrigos', color: 'Camel', rating: 4.8, reviews: 73, tag: '-20%' },
   { id: 7, name: 'Bolso de piel', price: 135, category: 'accesorios', type: 'Bolsos', color: 'Cuero', rating: 4.7, reviews: 156 },
   { id: 8, name: 'Botines de cuero', price: 145, category: 'accesorios', type: 'Zapatos', color: 'Cuero', rating: 4.9, reviews: 88, tag: 'Nuevo' },
   { id: 9, name: 'Camiseta esencial', price: 29, category: 'hombre', type: 'Camisetas', color: 'Crudo', rating: 4.4, reviews: 312 },
   { id: 10, name: 'Falda plisada', price: 69, category: 'mujer', type: 'Faldas', color: 'Arena', rating: 4.6, reviews: 54 },
   { id: 11, name: 'Chaqueta de ante', price: 215, oldPrice: 269, category: 'hombre', type: 'Chaquetas', color: 'Tierra', rating: 4.8, reviews: 39, tag: '-20%' },
   { id: 12, name: 'Bufanda de lana', price: 45, category: 'accesorios', type: 'Bufandas', color: 'Terracota', rating: 4.7, reviews: 121 },
]

// Devuelve los productos en el MISMO orden que los ids recibidos
// (la home quiere un orden concreto en "Destacados", no el del array)
export const getProductsByIds = (ids: number[]): Product[] =>
   ids
      .map((id) => MOCK_PRODUCTS.find((product) => product.id === id))
      .filter((product): product is Product => product !== undefined)

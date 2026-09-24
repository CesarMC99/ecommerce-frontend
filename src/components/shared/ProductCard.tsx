import type { ProductCardFieldsFragment } from '@/graphql/generated/graphql'
import { formatPrice } from '@/lib/format-price'
import { productRoute } from '@/lib/routes'
import Link from 'next/link'
import { CloudinaryImage } from './CloudinaryImage'
import { SpriteIcon } from './SpriteIcon'

interface ProductCardProps {
   // El tipo sale del fragment ProductCardFields (Codegen): la tarjeta
   // declara exactamente qué campos necesita y TypeScript avisa si una
   // query se olvida de pedir alguno
   product: ProductCardFieldsFragment
}

// Etiqueta sobre la foto. El descuento tiene prioridad sobre "Nuevo":
// si ambas aplican, el precio rebajado es lo que más interesa al cliente.
// Las dos reglas (¿rebajado?, ¿nuevo?) las calcula el BACKEND: aquí solo
// se decide cómo mostrarlas
const getProductTag = (product: ProductCardFieldsFragment) => {
   if (product.discountPercentage) return `-${product.discountPercentage}%`
   if (product.isNew) return 'Nuevo'
   return null
}

// Tarjeta de producto. Vive en `shared` porque se reutiliza en la home,
// el catálogo, favoritos y "También te puede gustar" del detalle
export function ProductCard({ product }: ProductCardProps) {
   const href = productRoute(product.slug)
   const tag = getProductTag(product)

   return (
      <article>
         {/* `group` permite que los hijos reaccionen al hover de este contenedor
             (así aparece "AÑADIR AL CARRITO" al pasar el ratón por la foto) */}
         <div className="group relative overflow-hidden rounded">
            {/* El enlace y los botones son HERMANOS, no anidados: un <button>
                dentro de un <a> es HTML inválido y rompe la navegación por teclado */}
            {/* `block`: un <a> es inline por defecto y deja un hueco de unos px
                bajo la imagen (el espacio reservado para letras como "g" o "p"),
                por donde asomaría la barra de "AÑADIR AL CARRITO" */}
            <Link
               href={href}
               aria-label={product.name}
               className="block"
            >
               <CloudinaryImage
                  image={product.mainImage}
                  className="aspect-3/4"
                  // Las fotos de producto tienen proporciones distintas (de 0.56
                  // a 0.80): se recortan a 3:4 respetando la prenda
                  autoCrop="3:4"
                  // La tarjeta ocupa media pantalla en móvil (2 columnas) y un
                  // cuarto en escritorio (4 columnas), hasta el ancho máximo de
                  // 1280 px del Container: así el navegador pide la foto justa
                  sizes="(min-width: 1280px) 300px, (min-width: 768px) 25vw, 50vw"
               />
            </Link>

            {tag && (
               <span className="absolute top-3 left-3 bg-coral-principal px-2 py-1 text-[10px] font-helvetica-bold tracking-[0.04em] text-white">
                  {tag}
               </span>
            )}

            {/* TODO(favoritos): conectar al estado de favoritos en su página */}
            <button
               type="button"
               aria-label={`Añadir ${product.name} a favoritos`}
               className="absolute top-2.5 right-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-neutro-1 text-coral-principal"
            >
               <SpriteIcon
                  name="heart"
                  className="size-4"
               />
            </button>

            {/* TODO(carrito): conectar al estado del carrito en su página.
                `focus-visible` hace que también aparezca al llegar con el
                tabulador, no solo con el ratón (hover no existe en teclado).
                Se esconde al 101% y no al 100%: con el redondeo de subpíxeles
                asomaba una línea oscura de 1px bajo la foto */}
            <button
               type="button"
               className="absolute inset-x-0 bottom-0 translate-y-[101%] cursor-pointer bg-brown-principal p-3 text-[11px] tracking-[0.08em] text-neutro-2 transition-transform duration-300 group-hover:translate-y-0 focus-visible:translate-y-0"
            >
               AÑADIR AL CARRITO
            </button>
         </div>

         <Link
            href={href}
            className="mt-3 block text-sm font-helvetica-medium"
         >
            {product.name}
         </Link>

         <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm">{formatPrice(product.price)}</span>
            {/* Se comprueba el DESCUENTO (regla del backend) y no solo que
                exista compareAtPrice: si alguien guardara un precio anterior
                menor que el actual, no se mostraría un tachado absurdo.
                Y `!== null` en vez de `&&`: con `&&`, un 0 se pintaría como "0" */}
            {product.discountPercentage !== null &&
               product.compareAtPrice !== null && (
               <span className="text-xs text-brown-1 line-through">
                  {formatPrice(product.compareAtPrice)}
               </span>
            )}
         </div>
      </article>
   )
}

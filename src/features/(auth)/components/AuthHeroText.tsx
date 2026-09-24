'use client'

import { usePathname } from 'next/navigation'

const content: Record<string, { heading: string; subheading: string }> = {
   '/login': {
      heading: 'Bienvenido de nuevo a tu guardarropa esencial.',
      subheading:
         'Únete y disfruta de acceso anticipado a nuevas colecciones y ofertas exclusivas.',
   },
   '/register': {
      heading: 'Crea tu cuenta y descubre tu estilo.',
      subheading:
         'Un 10% de descuento en tu primer pedido y acceso anticipado a colecciones.',
   },
}

export const AuthHeroText = () => {
   const path = usePathname()
   const { heading, subheading } = content[path] ?? content['/login']

   return (
      <div className="flex flex-col gap-5">
         <p className="text-[42px] text-neutro-1 font-bricolage-bold leading-[1.05]">
            {heading}
         </p>
         <p className="max-w-[340px] text-[15px] text-white/70 font-helvetica-roman leading-[1.2]">
            {subheading}
         </p>
      </div>
   )
}

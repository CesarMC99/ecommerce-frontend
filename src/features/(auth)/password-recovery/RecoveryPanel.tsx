import Link from 'next/link'

interface RecoveryPanelProps {
   title: string
   description: React.ReactNode
   /** Enlace de escape bajo el formulario ("Volver a iniciar sesión") */
   backHref: string
   backLabel: string
}

// Columna del formulario en las páginas de recuperación. Como AuthBase del
// login pero SIN el botón de Google (aquí no se inicia sesión)
export function RecoveryPanel({
   title,
   description,
   backHref,
   backLabel,
   children,
}: React.PropsWithChildren<RecoveryPanelProps>) {
   return (
      <section className="flex w-full max-w-[380px] flex-col gap-8">
         <div>
            <h1 className="font-bricolage-bold text-[32px] text-brown-principal">
               {title}
            </h1>
            <p className="mt-1 font-helvetica-roman text-sm leading-relaxed text-brown-1">
               {description}
            </p>
         </div>
         {children}
         <Link
            href={backHref}
            className="text-[13px] text-coral-principal hover:underline"
         >
            ← {backLabel}
         </Link>
      </section>
   )
}

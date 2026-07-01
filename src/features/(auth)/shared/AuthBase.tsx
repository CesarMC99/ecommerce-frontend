import { Separator } from '@/components/shared/Separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AuthBaseProps {
   title: string
   subtitleText: string
   linkText: string
   linkHref: string
   children: React.ReactNode
}

export function AuthBase({
   title,
   subtitleText,
   linkText,
   linkHref,
   children,
}: AuthBaseProps) {
   return (
      <section className="flex flex-col gap-8 max-w-[380px] w-full">
         <div>
            <h1 className="font-bricolage-bold text-[32px] text-brown-principal">
               {title}
            </h1>
            <p className="font-helvetica-roman text-sm text-brown-1">
               {subtitleText}{' '}
               <Link
                  href={linkHref}
                  className="text-coral-principal"
               >
                  {linkText}
               </Link>
            </p>
         </div>

         <div className="flex flex-col gap-5">
            {children}

            <Separator>o</Separator>

            <Button
               variant={'google'}
               type="button"
               className="flex items-center justify-center gap-2"
            >
               <svg className="size-4 text-coral-principal">
                  <use href="/images/icons/sprite.svg#google" />
               </svg>
               <span>Continuar con Google</span>
            </Button>
         </div>
      </section>
   )
}

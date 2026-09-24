import { Separator } from '@/components/shared/Separator'
import Link from 'next/link'
import { GoogleLoginButton } from './GoogleLoginButton'

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

            <GoogleLoginButton />
         </div>
      </section>
   )
}

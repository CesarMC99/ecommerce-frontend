'use client'
// Es Client Component porque tiene estado (el formulario y el mensaje de
// confirmación). El resto de la home sigue siendo de servidor: solo esta
// pieza pequeña envía JavaScript al navegador

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// El esquema es la única fuente de verdad: de él salen la validación
// Y el tipo de los datos (z.infer), así nunca se desincronizan
const newsletterSchema = z.object({
   email: z.email('Introduce un correo válido'),
})

type NewsletterValues = z.infer<typeof newsletterSchema>

export const Newsletter = () => {
   const [subscribed, setSubscribed] = useState(false)

   const form = useForm<NewsletterValues>({
      resolver: zodResolver(newsletterSchema),
      defaultValues: { email: '' },
   })

   const onSubmit = async () => {
      // TODO(backend): no existe aún una mutation de suscripción.
      // Cuando exista, aquí se llama con useMutation y los tipos de Codegen
      setSubscribed(true)
      form.reset()
   }

   const emailError = form.formState.errors.email?.message

   return (
      <section className="bg-brown-principal">
         <div className="mx-auto max-w-[760px] px-4 py-[72px] text-center md:px-10">
            <h2 className="font-bricolage-bold text-[34px] tracking-[-0.02em] text-neutro-3">
               Únete al círculo ÁMBAR
            </h2>
            <p className="mt-3 text-[15px] text-neutro-3/60">
               Acceso anticipado a colecciones y un 10% en tu primer pedido.
            </p>

            {subscribed ? (
               // role="status": el lector de pantalla anuncia el mensaje
               // aunque el foco no se mueva hasta aquí
               <p
                  role="status"
                  className="mt-7 text-sm text-coral-1"
               >
                  ✓ ¡Suscripción confirmada! Revisa tu correo
               </p>
            ) : (
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                  className="mx-auto mt-7 max-w-[440px]"
               >
                  <div className="flex">
                     <label
                        htmlFor="newsletter-email"
                        className="sr-only"
                     >
                        Correo electrónico
                     </label>
                     <input
                        id="newsletter-email"
                        type="email"
                        placeholder="Tu correo electrónico"
                        aria-invalid={!!emailError}
                        {...form.register('email')}
                        className="min-w-0 flex-1 border border-white/25 bg-transparent px-[18px] py-[15px] text-sm text-neutro-3 outline-none transition-colors placeholder:text-neutro-3/40 focus:border-coral-1"
                     />
                     <button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="cursor-pointer whitespace-nowrap bg-coral-1 px-[26px] py-[15px] text-[13px] font-helvetica-bold text-brown-principal disabled:opacity-50"
                     >
                        Suscribirme
                     </button>
                  </div>
                  {emailError && (
                     <p className="mt-2 text-left text-xs text-coral-1">
                        {emailError}
                     </p>
                  )}
               </form>
            )}
         </div>
      </section>
   )
}

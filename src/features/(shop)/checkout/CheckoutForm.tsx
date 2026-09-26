'use client'

import { InputField } from '@/components/shared/InputField'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { CheckoutInput } from '@/graphql/generated/graphql'
import { SHIPPING_COUNTRIES } from '@/graphql/modules/locations/queries/locations.queries'
import { MY_CART } from '@/graphql/modules/cart/queries/cart.queries'
import { START_CHECKOUT } from '@/graphql/modules/orders/mutations/checkout.mutations'
import { formatPrice } from '@/lib/format-price'
import { getErrorMessage } from '@/lib/graphql-error'
import { checkoutConfirmationRoute } from '@/lib/routes'
import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { StripeError } from '@stripe/stripe-js'
import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { FormServerError } from '../../(auth)/shared/FormServerError'
import { SubmitButton } from '../../(auth)/shared/SubmitButton'
import { CityField, CountryField } from './LocationFields'
import {
   checkoutSchema,
   DEFAULT_COUNTRY,
   type CheckoutFormValues,
} from './shipping-address.schema'

const GENERIC_PAYMENT_ERROR =
   'No se pudo procesar el pago. Inténtalo de nuevo o usa otra tarjeta.'

interface CheckoutFormProps {
   /** Correo de la cuenta: se propone, pero se puede cambiar */
   accountEmail: string
   total: number
   /** Hay productos agotados en el carrito: el backend rechazaría el pago */
   blocked: boolean
}

/** Pedido ya creado en el backend para ESTOS datos (ver reutilización abajo). */
interface PreparedPayment {
   inputKey: string
   total: number
   orderId: string
   clientSecret: string
}

/**
 * Checkout en UNA pantalla: contacto, envío y tarjeta, con un solo botón.
 *
 * Orden al pulsar "Pagar" (el que recomienda Stripe):
 *  1. Validar el formulario (zod) y la tarjeta (elements.submit()).
 *  2. Crear el pedido en el backend: reserva stock y crea el cobro.
 *  3. Confirmar el cobro con la tarjeta (stripe.confirmPayment).
 * Así el stock solo se reserva cuando TODO lo escrito es válido.
 */
export function CheckoutForm({ accountEmail, total, blocked }: CheckoutFormProps) {
   const stripe = useStripe()
   const elements = useElements()
   const router = useRouter()
   const [isCardReady, setIsCardReady] = useState(false)
   const [serverError, setServerError] = useState<string>()
   // Pagado: se queda en "Procesando…" mientras navega a la confirmación
   const [isRedirecting, setIsRedirecting] = useState(false)
   // Si el pago falla (tarjeta rechazada) y reintenta con los MISMOS datos,
   // se reutiliza el pedido y el cobro ya creados en vez de crear otros.
   // useRef y no useState: no se pinta, solo se consulta al pagar
   const preparedRef = useRef<PreparedPayment | null>(null)

   const { data: countriesData } = useQuery(SHIPPING_COUNTRIES)
   const countries = countriesData?.shippingCountries ?? []

   const [startCheckout] = useMutation(START_CHECKOUT, {
      // Si falla por stock, el carrito cambió: se recarga para mostrarlo
      refetchQueries: [{ query: MY_CART }],
   })

   const form = useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
         email: accountEmail,
         fullName: '',
         country: DEFAULT_COUNTRY,
         city: '',
         line1: '',
         phone: '',
      },
   })
   const isSubmitting = form.formState.isSubmitting || isRedirecting
   // useWatch (y no form.watch): compatible con React Compiler
   const countryCode = useWatch({ control: form.control, name: 'country' })
   const dialCode = countries.find((c) => c.code === countryCode)?.dialCode

   /** Crea el pedido, o reutiliza el anterior si nada ha cambiado. */
   const preparePayment = async (input: CheckoutInput) => {
      const inputKey = JSON.stringify(input)
      const prepared = preparedRef.current
      if (prepared && prepared.inputKey === inputKey && prepared.total === total) {
         return prepared
      }
      const { data } = await startCheckout({ variables: { input } })
      if (!data) throw new Error('Respuesta vacía de startCheckout')
      const { order, clientSecret } = data.startCheckout
      preparedRef.current = { inputKey, total, orderId: order.id, clientSecret }
      return preparedRef.current
   }

   const onValid = async (values: CheckoutFormValues) => {
      if (!stripe || !elements) return
      setServerError(undefined)

      // 1. Valida la tarjeta. Los errores ("número incompleto") salen
      //    dentro del propio formulario de Stripe
      const { error: cardError } = await elements.submit()
      if (cardError) return

      const input: CheckoutInput = {
         email: values.email.trim().toLowerCase(),
         shippingAddress: {
            fullName: values.fullName,
            phone: values.phone,
            line1: values.line1,
            city: values.city,
            country: values.country,
         },
      }

      // 2. Pedido + reserva de stock + cobro (backend)
      let prepared: PreparedPayment
      try {
         prepared = await preparePayment(input)
      } catch (error) {
         // El mensaje para el cliente es genérico si no hubo respuesta del
         // servidor; el error completo queda en la consola para depurar
         console.error('[checkout] No se pudo preparar el pago:', error)
         setServerError(getErrorMessage(error))
         return
      }

      // 3. Cobrar. Nombre, correo, teléfono y dirección se los damos
      //    nosotros (el formulario de Stripe solo pide la tarjeta)
      const phone =
         parsePhoneNumberFromString(values.phone, values.country as CountryCode)
            ?.number ?? null
      const { error } = await stripe.confirmPayment({
         elements,
         clientSecret: prepared.clientSecret,
         confirmParams: {
            // Si el banco pide 3-D Secure, Stripe vuelve aquí después
            return_url:
               window.location.origin + checkoutConfirmationRoute(prepared.orderId),
            payment_method_data: {
               billing_details: {
                  name: values.fullName,
                  email: input.email,
                  phone,
                  address: {
                     country: values.country,
                     city: values.city,
                     line1: values.line1,
                     line2: null,
                     postal_code: null,
                     state: null,
                  },
               },
            },
         },
         // Solo sale de la tienda si el método lo exige (3-D Secure)
         redirect: 'if_required',
      })

      if (error) {
         setServerError(toPaymentMessage(error))
         // El cobro ya no se puede usar (caducó o se canceló): el próximo
         // intento creará un pedido nuevo
         if (error.code === 'payment_intent_unexpected_state') {
            preparedRef.current = null
         }
         return
      }

      // La confirmación pregunta al BACKEND si está pagado de verdad
      setIsRedirecting(true)
      router.replace(checkoutConfirmationRoute(prepared.orderId))
   }

   return (
      <form
         // Si el formulario tiene errores, también se muestran los de la
         // tarjeta: el cliente ve TODO lo que falta de una vez
         onSubmit={form.handleSubmit(onValid, () => void elements?.submit())}
         noValidate
         className="flex flex-col gap-10"
      >
         <Section title="Contacto">
            <InputField
               name="email"
               control={form.control}
               label="CORREO ELECTRÓNICO"
               type="email"
               placeholder="tu@email.com"
               autoComplete="email"
               disabled={isSubmitting}
            />
            <p className="-mt-3 text-xs text-brown-1">
               Te enviaremos aquí el recibo y el seguimiento del pedido.
            </p>
         </Section>

         <Section title="Envío">
            <InputField
               name="fullName"
               control={form.control}
               label="NOMBRE Y APELLIDOS"
               placeholder="Lucía García"
               autoComplete="name"
               disabled={isSubmitting}
            />
            <div className="grid gap-5 sm:grid-cols-2">
               <CountryField
                  control={form.control}
                  countries={countries}
                  disabled={isSubmitting}
                  // La ciudad era de otro país: se vacía. Y el teléfono se
                  // revalida con las reglas del país nuevo (si ya se escribió)
                  onCountryChange={() => {
                     form.setValue('city', '')
                     if (form.getValues('phone')) void form.trigger('phone')
                  }}
               />
               {/* key: al cambiar de país el buscador de ciudades empieza de cero */}
               <CityField
                  key={countryCode}
                  control={form.control}
                  countryCode={countryCode}
                  disabled={isSubmitting}
               />
            </div>
            <InputField
               name="line1"
               control={form.control}
               label="DIRECCIÓN"
               placeholder="Calle Mayor 12, 3º B"
               autoComplete="street-address"
               disabled={isSubmitting}
            />
            <Controller
               name="phone"
               control={form.control}
               render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                     <FieldLabel
                        htmlFor="phone"
                        className="text-xs font-normal tracking-[0.06em] text-brown-1"
                     >
                        TELÉFONO
                     </FieldLabel>
                     <div className="flex">
                        {/* Prefijo del país elegido: el cliente escribe solo su número */}
                        <span className="flex min-w-[64px] items-center justify-center rounded-l-md border border-r-0 border-beige-2 bg-neutro-2 px-3 text-sm text-brown-2">
                           {dialCode ? `+${dialCode}` : '—'}
                        </span>
                        <Input
                           {...field}
                           id="phone"
                           type="tel"
                           // inputMode: en el móvil abre el teclado numérico
                           inputMode="tel"
                           autoComplete="tel-national"
                           placeholder="612 345 678"
                           // Solo cifras y espacios: cualquier otra tecla se ignora
                           onChange={(event) =>
                              field.onChange(event.target.value.replace(/[^\d\s]/g, ''))
                           }
                           aria-invalid={fieldState.invalid}
                           disabled={isSubmitting}
                           className="rounded-l-none rounded-r-md border border-beige-2 bg-white px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(194,94,58,0.12)] focus-visible:ring-0"
                        />
                     </div>
                     {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
               )}
            />
         </Section>

         <Section title="Pago">
            <div className="relative min-h-[140px]">
               {!isCardReady && (
                  <div
                     role="status"
                     aria-label="Cargando formulario de pago"
                     className="absolute inset-0 flex items-center justify-center"
                  >
                     <span className="size-7 animate-spin rounded-full border-2 border-beige-3 border-t-coral-principal" />
                  </div>
               )}
               <PaymentElement
                  onReady={() => setIsCardReady(true)}
                  options={{
                     layout: 'tabs',
                     // Estos datos ya los pide nuestro formulario: Stripe
                     // solo muestra número, caducidad y CVC
                     fields: { billingDetails: 'never' },
                     // Sin Link (el autocompletado de Stripe pide correo o
                     // teléfono otra vez). Google Pay / Apple Pay se quedan:
                     // no piden nada y aparecen solo si el dispositivo los tiene
                     wallets: { link: 'never' },
                  }}
               />
            </div>
         </Section>

         <div className="flex flex-col gap-4">
            <FormServerError message={serverError} />
            {/* Deshabilitado hasta que Stripe esté listo (o si hay agotados) */}
            <fieldset
               disabled={!stripe || !isCardReady || blocked}
               className="contents"
            >
               <SubmitButton
                  isLoading={isSubmitting}
                  label={`Pagar ${formatPrice(total)}`}
                  loadingLabel="Procesando el pago…"
               />
            </fieldset>
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] tracking-[0.06em] text-brown-1">
               <span aria-hidden>🔒</span> PAGO SEGURO CON STRIPE · NO GUARDAMOS
               LOS DATOS DE TU TARJETA
            </p>
         </div>
      </form>
   )
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
   return (
      <section className="flex flex-col gap-5">
         <h2 className="font-bricolage-semibold text-2xl text-brown-principal">
            {title}
         </h2>
         <FieldGroup>{children}</FieldGroup>
      </section>
   )
}

/**
 * card_error / validation_error traen un mensaje pensado para el cliente
 * ("Tu tarjeta no tiene fondos suficientes"), ya en español. El resto son
 * fallos técnicos: mejor un mensaje genérico.
 */
function toPaymentMessage(error: StripeError): string {
   if ((error.type === 'card_error' || error.type === 'validation_error') && error.message) {
      return error.message
   }
   return GENERIC_PAYMENT_ERROR
}

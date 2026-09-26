'use client'

import { Combobox, type ComboboxOption } from '@/components/shared/Combobox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import type { ShippingCountriesQuery } from '@/graphql/generated/graphql'
import { SEARCH_CITIES } from '@/graphql/modules/locations/queries/locations.queries'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { Controller, type Control } from 'react-hook-form'
import type { CheckoutFormValues } from './shipping-address.schema'

type Country = ShippingCountriesQuery['shippingCountries'][number]

const LABEL_CLASS = 'text-xs text-brown-1 tracking-[0.06em] font-normal'

interface CountryFieldProps {
   control: Control<CheckoutFormValues>
   countries: Country[]
   disabled?: boolean
   /** Al cambiar de país la ciudad elegida deja de valer: la página la vacía */
   onCountryChange: () => void
}

export function CountryField({
   control,
   countries,
   disabled,
   onCountryChange,
}: CountryFieldProps) {
   const options: ComboboxOption[] = countries.map((country) => ({
      value: country.code,
      label: country.name,
      hint: `+${country.dialCode}`,
   }))

   return (
      <Controller
         name="country"
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel
                  htmlFor="country"
                  className={LABEL_CLASS}
               >
                  PAÍS
               </FieldLabel>
               <Combobox
                  id="country"
                  value={field.value}
                  onChange={(value) => {
                     if (value !== field.value) {
                        field.onChange(value)
                        onCountryChange()
                     }
                  }}
                  onBlur={field.onBlur}
                  options={options}
                  placeholder="Elige un país"
                  searchPlaceholder="Buscar país…"
                  emptyText="No enviamos a ese país"
                  invalid={fieldState.invalid}
                  disabled={disabled || countries.length === 0}
               />
               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
         )}
      />
   )
}

interface CityFieldProps {
   control: Control<CheckoutFormValues>
   countryCode: string
   disabled?: boolean
}

// Ciudad: SOLO de la lista del país elegido. La búsqueda se hace en el
// servidor (el listado mundial pesa varios MB) mientras se escribe
export function CityField({ control, countryCode, disabled }: CityFieldProps) {
   const [search, setSearch] = useState('')
   const debouncedSearch = useDebouncedValue(search)

   const { data, previousData, loading } = useQuery(SEARCH_CITIES, {
      variables: { countryCode, search: debouncedSearch, limit: 20 },
      skip: !countryCode,
   })
   // previousData: mientras llega la nueva búsqueda se ven los resultados
   // anteriores en vez de una lista vacía que parpadea
   const cities = (data ?? previousData)?.searchCities ?? []
   const options: ComboboxOption[] = cities.map((city) => ({
      value: city.name,
      label: city.name,
   }))

   return (
      <Controller
         name="city"
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel
                  htmlFor="city"
                  className={LABEL_CLASS}
               >
                  CIUDAD
               </FieldLabel>
               <Combobox
                  id="city"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={options}
                  onSearchChange={setSearch}
                  loading={loading || search !== debouncedSearch}
                  placeholder={countryCode ? 'Elige una ciudad' : 'Elige antes un país'}
                  searchPlaceholder="Escribe tu ciudad…"
                  emptyText="No encontramos esa ciudad"
                  invalid={fieldState.invalid}
                  disabled={disabled || !countryCode}
               />
               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
         )}
      />
   )
}

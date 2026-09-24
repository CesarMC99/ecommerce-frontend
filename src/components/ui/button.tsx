import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
   // clases base que aplican siempre
   'inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
   {
      variants: {
         variant: {
            default: '',
            primary:
               'bg-coral-principal border border-transparent text-white w-full py-3 cursor-pointer',
            secondary:
               'bg-white border border-brown-3 text-brown-3 w-full py-3',
            google:
               'bg-white border border-beige-2 text-brown-principal w-full py-3 cursor-pointer',
         },
         size: {
            default: '',
         },
      },
      defaultVariants: {
         variant: 'default',
         size: 'default',
      },
   },
)

function Button({
   className,
   variant,
   size,
   asChild = false,
   ...props
}: React.ComponentProps<'button'> &
   VariantProps<typeof buttonVariants> & {
      asChild?: boolean
   }) {
   const Comp = asChild ? Slot.Root : 'button'

   return (
      <Comp
         className={cn(buttonVariants({ variant, size, className }))}
         {...props}
      />
   )
}

export { Button, buttonVariants }

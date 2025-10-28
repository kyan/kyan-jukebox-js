'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
  const orientationClass =
    orientation === 'horizontal' ? 'separator--horizontal' : 'separator--vertical'
  const classes = ['separator', orientationClass, className].filter(Boolean).join(' ')

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={classes}
      {...props}
    />
  )
})
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

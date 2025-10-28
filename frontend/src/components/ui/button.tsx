import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    const variantClass = variant ? `btn--${variant}` : ''
    const sizeClass = size === 'default' ? 'btn--default-size' : `btn--${size}`

    return <Comp className={cn('btn', variantClass, sizeClass, className)} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }

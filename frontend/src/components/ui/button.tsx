import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

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
    const classes = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ')

    return <Comp className={classes} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button }

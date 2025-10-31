import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClass = variant ? `alert--${variant}` : ''
    return (
      <div ref={ref} role='alert' className={cn('alert', variantClass, className)} {...props} />
    )
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h5 ref={ref} className={cn('alert-title', className)} {...props} />
  }
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('alert-description', className)} {...props} />
})
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

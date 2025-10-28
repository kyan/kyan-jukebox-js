import * as React from 'react'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClass = variant ? `alert--${variant}` : ''
    const classes = ['alert', variantClass, className].filter(Boolean).join(' ')

    return <div ref={ref} role='alert' className={classes} {...props} />
  }
)
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['alert-title', className].filter(Boolean).join(' ')
    return <h5 ref={ref} className={classes} {...props} />
  }
)
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const classes = ['alert-description', className].filter(Boolean).join(' ')
  return <div ref={ref} className={classes} {...props} />
})
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }

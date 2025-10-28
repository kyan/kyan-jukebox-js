import * as React from 'react'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['card', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...props} />
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['card-header', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...props} />
  }
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['card-title', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...props} />
  }
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['card-description', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...props} />
  }
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['card-content', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...props} />
  }
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['card-footer', className].filter(Boolean).join(' ')
    return <div ref={ref} className={classes} {...props} />
  }
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

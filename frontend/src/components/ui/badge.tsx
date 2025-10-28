import * as React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClass = variant ? `badge--${variant}` : ''
    const classes = ['badge', variantClass, className].filter(Boolean).join(' ')

    return <div ref={ref} className={classes} {...props} />
  }
)
Badge.displayName = 'Badge'

export { Badge }

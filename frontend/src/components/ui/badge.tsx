import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClass = variant ? `badge--${variant}` : ''
    return <div ref={ref} className={cn('badge', variantClass, className)} {...props} />
  }
)
Badge.displayName = 'Badge'

export { Badge }

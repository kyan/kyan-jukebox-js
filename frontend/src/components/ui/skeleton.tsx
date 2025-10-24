import * as React from 'react'
import { cn } from 'lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-md bg-muted',
          variant === 'default' && 'animate-pulse',
          variant === 'shimmer' && 'skeleton-shimmer',
          className
        )}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Specialized skeleton components for common use cases
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 1, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && lines > 1 && 'w-4/5')}
        />
      ))}
    </div>
  )
})

SkeletonText.displayName = 'SkeletonText'

const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        <Skeleton className='h-48 w-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      </div>
    )
  }
)

SkeletonCard.displayName = 'SkeletonCard'

const SkeletonTrack = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
        <Skeleton className='h-12 w-12 rounded' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/2' />
        </div>
        <Skeleton className='h-8 w-8 rounded-full' />
      </div>
    )
  }
)

SkeletonTrack.displayName = 'SkeletonTrack'

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-full', sizeClasses[size], className)}
      {...props}
    />
  )
})

SkeletonAvatar.displayName = 'SkeletonAvatar'

const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }

  return (
    <Skeleton
      ref={ref}
      className={cn('rounded-md', sizeClasses[size], className)}
      {...props}
    />
  )
})

SkeletonButton.displayName = 'SkeletonButton'

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTrack,
  SkeletonAvatar,
  SkeletonButton
}

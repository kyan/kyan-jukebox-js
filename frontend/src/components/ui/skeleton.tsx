import * as React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClass = variant === 'default' ? 'skeleton--pulse' : 'skeleton--shimmer'
    const classes = ['skeleton', variantClass, className].filter(Boolean).join(' ')

    return <div ref={ref} className={classes} {...props} />
  }
)

Skeleton.displayName = 'Skeleton'

// Specialized skeleton components for common use cases
const SkeletonText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 1, ...props }, ref) => {
  const classes = ['skeleton-text--lines', className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`skeleton-text ${i === lines - 1 && lines > 1 ? 'skeleton-text--last-short' : ''}`}
        />
      ))}
    </div>
  )
})

SkeletonText.displayName = 'SkeletonText'

const SkeletonCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['skeleton-card', className].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={classes} {...props}>
        <Skeleton className='skeleton-card-image' />
        <div className='skeleton-card-content'>
          <Skeleton className='skeleton-text' />
          <Skeleton className='skeleton-text skeleton-text--last-short' />
        </div>
      </div>
    )
  }
)

SkeletonCard.displayName = 'SkeletonCard'

const SkeletonTrack = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const classes = ['skeleton-track', className].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={classes} {...props}>
        <Skeleton className='skeleton-track-artwork' />
        <div className='skeleton-track-content'>
          <Skeleton className='skeleton-text' />
          <Skeleton className='skeleton-text skeleton-text--last-short' />
        </div>
        <Skeleton className='skeleton-avatar--md skeleton-avatar' />
      </div>
    )
  }
)

SkeletonTrack.displayName = 'SkeletonTrack'

const SkeletonAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClass = `skeleton-avatar--${size}`
  const classes = ['skeleton', 'skeleton-avatar', sizeClass, className].filter(Boolean).join(' ')

  return <div ref={ref} className={classes} {...props} />
})

SkeletonAvatar.displayName = 'SkeletonAvatar'

const SkeletonButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClass = `skeleton-button--${size}`
  const classes = ['skeleton', 'skeleton-button', sizeClass, className].filter(Boolean).join(' ')

  return <div ref={ref} className={classes} {...props} />
})

SkeletonButton.displayName = 'SkeletonButton'

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTrack, SkeletonAvatar, SkeletonButton }

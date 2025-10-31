import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      className={cn('pagination', className)}
      {...props}
    />
  )
}
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => {
    return <ul ref={ref} className={cn('pagination-content', className)} {...props} />
  }
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} className={className} {...props} />
  }
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => {
  const variantClass = isActive ? 'pagination-link--outline' : 'pagination-link--ghost'
  const sizeClass =
    size === 'default' ? 'pagination-link--default-size' : `pagination-link--${size}`

  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn('pagination-link', variantClass, sizeClass, className)}
      {...props}
    />
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('pagination-previous', className)}
      {...props}
    >
      <ChevronLeft />
      <span>Previous</span>
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('pagination-next', className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span aria-hidden className={cn('pagination-ellipsis', className)} {...props}>
      <MoreHorizontal />
      <span className='sr-only'>More pages</span>
    </span>
  )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
}

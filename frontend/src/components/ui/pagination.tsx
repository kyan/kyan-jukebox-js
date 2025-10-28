import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { ButtonProps } from '@/components/ui/button'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  const classes = ['pagination', className].filter(Boolean).join(' ')
  return <nav role='navigation' aria-label='pagination' className={classes} {...props} />
}
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => {
    const classes = ['pagination-content', className].filter(Boolean).join(' ')
    return <ul ref={ref} className={classes} {...props} />
  }
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => {
    const classes = [className].filter(Boolean).join(' ')
    return <li ref={ref} className={classes} {...props} />
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
  const classes = ['pagination-link', variantClass, sizeClass, className].filter(Boolean).join(' ')

  return <a aria-current={isActive ? 'page' : undefined} className={classes} {...props} />
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const classes = ['pagination-previous', className].filter(Boolean).join(' ')

  return (
    <PaginationLink aria-label='Go to previous page' size='default' className={classes} {...props}>
      <ChevronLeft />
      <span>Previous</span>
    </PaginationLink>
  )
}
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const classes = ['pagination-next', className].filter(Boolean).join(' ')

  return (
    <PaginationLink aria-label='Go to next page' size='default' className={classes} {...props}>
      <span>Next</span>
      <ChevronRight />
    </PaginationLink>
  )
}
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  const classes = ['pagination-ellipsis', className].filter(Boolean).join(' ')

  return (
    <span aria-hidden className={classes} {...props}>
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

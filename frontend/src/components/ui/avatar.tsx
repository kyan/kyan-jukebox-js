import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => {
  const classes = ['avatar', className].filter(Boolean).join(' ')
  return <AvatarPrimitive.Root ref={ref} className={classes} {...props} />
})
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => {
  const classes = ['avatar-image', className].filter(Boolean).join(' ')
  return <AvatarPrimitive.Image ref={ref} className={classes} {...props} />
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => {
  const classes = ['avatar-fallback', className].filter(Boolean).join(' ')
  return <AvatarPrimitive.Fallback ref={ref} className={classes} {...props} />
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

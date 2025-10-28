import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <SliderPrimitive.Root ref={ref} className={cn('slider-root', className)} {...props}>
      <SliderPrimitive.Track className='slider-track'>
        <SliderPrimitive.Range className='slider-range' />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className='slider-thumb' />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

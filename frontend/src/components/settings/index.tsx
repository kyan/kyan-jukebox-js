import React, { useState } from 'react'
import { getAvatarUrl } from '../../utils/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import ThemeToggle from 'components/theme-toggle'

interface User {
  fullname: string
  email: string
  picture?: string
}

interface SettingsProps {
  user?: User
  isSignedIn: boolean
  onSignOut: () => void
}

export const Settings: React.FC<SettingsProps> = ({ user, isSignedIn, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false)

  let avatar = (
    <Button
      variant='outline'
      size='icon'
      className='h-[45px] w-[45px] rounded-full border-border/50 bg-card/50 backdrop-blur-sm shadow-sm'
      title='Not signed in'
      disabled
    >
      <Icon name='power off' size='default' className='text-muted-foreground' />
    </Button>
  )

  if (isSignedIn && user) {
    const avatarUrl = getAvatarUrl(user, 50)

    avatar = (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className='h-[45px] w-[45px] cursor-pointer border-2 border-transparent rounded-full transition-all duration-300 hover:scale-110 hover:border-primary/50 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            aria-label='Open settings'
          >
            <Avatar className='h-full w-full shadow-md'>
              <AvatarImage src={avatarUrl} alt={user.fullname} className='object-cover' />
              <AvatarFallback className='text-sm font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'>
                {user.fullname
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='w-[280px] p-5 animate-slide-down shadow-xl border-border/50 bg-card/95 backdrop-blur-sm'
          align='end'
        >
          <div className='space-y-4'>
            <div className='space-y-2 pb-3 border-b border-border/50'>
              <div className='font-bold text-base text-foreground transition-colors'>
                {user.fullname}
              </div>
              <div className='text-sm text-muted-foreground transition-colors font-medium'>
                {user.email}
              </div>
            </div>
            <Button
              variant='default'
              size='default'
              className='w-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/90 font-semibold'
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
            >
              <Icon name='sign out' className='mr-2' size='small' />
              Sign Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <ThemeToggle />
      {avatar}
    </div>
  )
}

export default Settings

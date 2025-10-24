import React, { useState } from 'react'
import { getAvatarUrl } from '../../utils/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
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
    <Button variant='ghost' size='icon' className='float-right' title='Not signed in' disabled>
      <Icon name='power off' size='default' />
    </Button>
  )

  if (isSignedIn && user) {
    const avatarUrl = getAvatarUrl(user, 50)

    avatar = (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className='float-right cursor-pointer border-2 border-transparent rounded-full transition-all hover:opacity-80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            aria-label='Open settings'
          >
            <Avatar className='w-[50px] h-[50px]'>
              <AvatarImage src={avatarUrl} alt={user.fullname} />
              <AvatarFallback className='text-sm font-semibold'>
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
        <PopoverContent className='w-[240px] p-4 animate-slide-down' align='end'>
          <div className='space-y-4'>
            <div className='space-y-1'>
              <div className='font-semibold text-sm text-foreground transition-colors'>
                {user.fullname}
              </div>
              <div className='text-xs text-muted-foreground transition-colors'>{user.email}</div>
            </div>
            <Separator />
            <Button
              variant='default'
              size='sm'
              className='w-full transition-smooth hover-lift'
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
    <div className='flex items-center gap-2'>
      <ThemeToggle />
      {avatar}
    </div>
  )
}

export default Settings

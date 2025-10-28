import React, { useState } from 'react'
import { getAvatarUrl } from '@/utils/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'
import ThemeToggle from '@/components/theme-toggle'

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
    <button
      className='settings-button-disabled'
      title='Not signed in'
      disabled
      aria-label='Not signed in'
    >
      <Icon name='power off' size='default' />
    </button>
  )

  if (isSignedIn && user) {
    const avatarUrl = getAvatarUrl(user, 50)

    avatar = (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className='settings-avatar-button' aria-label='Open settings'>
            <Avatar className='settings-avatar'>
              <AvatarImage src={avatarUrl} alt={user.fullname} className='settings-avatar-image' />
              <AvatarFallback className='settings-avatar-fallback'>
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
        <PopoverContent className='settings-popover' align='end'>
          <div className='settings-popover-content'>
            <div className='settings-user-info'>
              <div className='settings-user-name'>{user.fullname}</div>
              <div className='settings-user-email'>{user.email}</div>
            </div>
            <button
              className='settings-signout-button'
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
              aria-label='Sign out'
            >
              <Icon name='sign out' size='small' />
              Sign Out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className='settings'>
      <ThemeToggle />
      {avatar}
    </div>
  )
}

export default Settings

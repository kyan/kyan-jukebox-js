import React from 'react'
import dateFormat from 'dateformat'
import { getAvatarUrl } from '../../utils/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'

interface User {
  picture?: string
  fullname?: string
  email?: string
}

interface AddedByData {
  user?: User
  addedAt: string
}

interface AddedByProps {
  users?: AddedByData[]
}

const addedByContent = (users: AddedByData[]) => (
  <div className='added-by-content'>
    <div className='added-by-list'>
      {users.slice(0, 10).map((data, i) => {
        const fullName = data.user && data.user.fullname ? data.user.fullname : 'User unknown'

        return (
          <div key={i} className='added-by-item'>
            {userPicture(data)}
            <div className='added-by-item-content'>
              <div className='added-by-item-text'>
                <strong className='added-by-item-date'>
                  {dateFormat(data.addedAt, 'dd mmm yyyy @ h:MM tt')}
                </strong>{' '}
                - {fullName}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

const userPicture = (data: AddedByData) => {
  if (data && data.user) {
    const avatarUrl = getAvatarUrl(data.user, 30)
    return (
      <Avatar className='added-by-avatar'>
        <AvatarImage src={avatarUrl} alt={data.user.fullname || 'User'} />
        <AvatarFallback className='added-by-avatar-fallback'>
          <Icon name='user' size='mini' />
        </AvatarFallback>
      </Avatar>
    )
  }
  return <Icon name='user' size='small' className='added-by-icon' />
}

const AddedBy: React.FC<AddedByProps> = ({ users = [] }) => {
  const [open, setOpen] = React.useState(false)
  const avatar = userPicture(users[0])
  if (!users.length) return avatar

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='added-by-trigger'
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {avatar}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='added-by-popover'
        align='start'
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {addedByContent(users)}
      </PopoverContent>
    </Popover>
  )
}

export default AddedBy

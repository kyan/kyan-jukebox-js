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
  <div className='text-xs max-h-[300px] overflow-y-auto pr-2.5 space-y-3'>
    {users.slice(0, 10).map((data, i) => {
      const fullName = data.user && data.user.fullname ? data.user.fullname : 'User unknown'

      return (
        <div key={i} className='flex items-center gap-2'>
          {userPicture(data)}
          <div className='flex-1'>
            <div className='text-muted-foreground'>
              <strong className='font-semibold text-foreground'>
                {dateFormat(data.addedAt, 'dd mmm yyyy @ h:MM tt')}
              </strong>{' '}
              - {fullName}
            </div>
          </div>
        </div>
      )
    })}
  </div>
)

const userPicture = (data: AddedByData) => {
  if (data && data.user) {
    const avatarUrl = getAvatarUrl(data.user, 50)
    return (
      <Avatar className='w-4 h-4'>
        <AvatarImage src={avatarUrl} alt={data.user.fullname || 'User'} />
        <AvatarFallback className='text-[8px]'>
          <Icon name='user' size='mini' />
        </AvatarFallback>
      </Avatar>
    )
  }
  return <Icon name='user' size='small' className='w-4 h-4' />
}

const AddedBy: React.FC<AddedByProps> = ({ users = [] }) => {
  const avatar = userPicture(users[0])
  if (!users.length) return avatar

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent p-0'>
          {avatar}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-auto min-w-[300px]' align='start'>
        {addedByContent(users)}
      </PopoverContent>
    </Popover>
  )
}

export default AddedBy

import React from 'react'
import dateFormat from 'dateformat'
import { getAvatarUrl } from '../../utils/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface User {
  picture?: string
  fullname?: string
  email?: string
}

interface Vote {
  user?: User
  vote: number
  at: string
}

interface VotedByProps {
  show?: boolean
  ribbon?: boolean
  votes?: Vote[]
  total: number
  size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive'
}

const voteNormaliser = (v: number) => {
  // Backend stores votes on 0-10 scale, we display -5 to +5
  // Simply subtract 5 to convert: 0 -> -5, 5 -> 0, 10 -> +5
  return Math.round(v - 5)
}

const votedByContent = (votes: Vote[]) => (
  <div className='space-y-3'>
    {votes.map((data, i) => {
      const fullName = data.user ? data.user.fullname : 'User unknown'
      const voteScore = voteNormaliser(data.vote)

      return (
        <div key={i} className='flex items-center gap-2'>
          {userPicture(data)}
          <div className='flex-1'>
            <div className='text-xs text-muted-foreground'>
              <strong className='font-semibold text-foreground'>
                {dateFormat(data.at, 'dd mmm yyyy @ h:MM tt')}
              </strong>{' '}
              - {fullName}{' '}
              <Badge variant='secondary' className='ml-1 rounded-full px-2 py-0 text-xs'>
                {voteScore}
              </Badge>
            </div>
          </div>
        </div>
      )
    })}
  </div>
)

const userPicture = (data: Vote) => {
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
  return null
}

const sizeMap = {
  mini: 'text-[10px] px-1.5 py-0',
  tiny: 'text-xs px-2 py-0.5',
  small: 'text-sm px-2.5 py-0.5',
  medium: 'text-base px-3 py-1',
  large: 'text-lg px-3.5 py-1',
  big: 'text-xl px-4 py-1.5',
  huge: 'text-2xl px-5 py-2',
  massive: 'text-3xl px-6 py-2.5'
}

const voteLabel = ({ total, size, ribbon }: { total: number; size?: string; ribbon?: boolean }) => {
  const normalisedTotal = voteNormaliser(total)

  let variant: 'default' | 'secondary' | 'destructive' = 'secondary'
  let icon: 'thumbs up' | 'thumbs down' = 'thumbs up'

  if (normalisedTotal < 0) icon = 'thumbs down'
  if (normalisedTotal > 4) variant = 'default' // green equivalent
  if (normalisedTotal < -4) variant = 'destructive' // red equivalent

  const sizeClass = sizeMap[(size as keyof typeof sizeMap) || 'tiny']

  return (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1 font-semibold',
        sizeClass,
        ribbon && 'absolute right-0 top-2 rounded-l-md rounded-r-none',
        normalisedTotal > 4 && 'bg-green-600 hover:bg-green-700 text-white border-green-600',
        normalisedTotal < -4 && 'bg-red-600 hover:bg-red-700 text-white border-red-600'
      )}
    >
      <Icon name={icon} size='mini' />
      <span>{normalisedTotal}</span>
    </Badge>
  )
}

const VotedBy: React.FC<VotedByProps> = ({ show, ribbon, votes = [], total, size }) => {
  const voteCount = votes.length
  if (!show) return null
  if (voteCount < 1) return voteLabel({ total, size, ribbon })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='cursor-pointer hover:opacity-90 transition-opacity border-none bg-transparent p-0'>
          {voteLabel({ total, size, ribbon })}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-auto min-w-[320px]' align='start'>
        {votedByContent(votes)}
      </PopoverContent>
    </Popover>
  )
}

export default VotedBy

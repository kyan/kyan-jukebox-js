import React from 'react'
import dateFormat from 'dateformat'
import { getAvatarUrl } from '@/utils/avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import '@/css/components/voted-by.css'

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
  <div className='voted-by-list'>
    {votes.map((data, i) => {
      const fullName = data.user ? data.user.fullname : 'User unknown'
      const voteScore = voteNormaliser(data.vote)

      return (
        <div key={i} className='voted-by-item'>
          {userPicture(data)}
          <div className='voted-by-content'>
            <span className='voted-by-date'>{dateFormat(data.at, 'dd mmm yyyy @ h:MM tt')}</span>
            <span className='voted-by-separator'>-</span>
            <span className='voted-by-name'>{fullName}</span>
            <Badge variant='secondary' className='voted-by-badge'>
              {voteScore}
            </Badge>
          </div>
        </div>
      )
    })}
  </div>
)

const userPicture = (data: Vote) => {
  if (data && data.user) {
    const avatarUrl = getAvatarUrl(data.user, 50)
    const initials = data.user.fullname
      ? data.user.fullname
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U'
    return (
      <Avatar className='voted-by-avatar'>
        <AvatarImage src={avatarUrl} alt={data.user.fullname || 'User'} />
        <AvatarFallback className='voted-by-avatar-fallback'>{initials}</AvatarFallback>
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
  if (normalisedTotal > 0) variant = 'default' // green equivalent
  if (normalisedTotal < 0) variant = 'destructive' // red equivalent

  const sizeClass = sizeMap[(size as keyof typeof sizeMap) || 'tiny']

  return (
    <Badge
      variant={variant}
      className={cn(
        'inline-flex items-center gap-1.5 font-bold',
        sizeClass,
        ribbon && 'rounded-lg shadow-lg backdrop-blur-sm border-2',
        normalisedTotal > 0 && 'bg-green-600/90 hover:bg-green-700 text-white border-white/30',
        normalisedTotal < 0 && 'bg-red-600/90 hover:bg-red-700 text-white border-white/30',
        normalisedTotal === 0 &&
          ribbon &&
          'bg-gray-800/80 hover:bg-gray-800/90 text-white border-white/30'
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
      <PopoverContent className='popover-voted-by' align='end'>
        {votedByContent(votes)}
      </PopoverContent>
    </Popover>
  )
}

export default VotedBy

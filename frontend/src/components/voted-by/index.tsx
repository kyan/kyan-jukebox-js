import React from 'react'
import dateFormat from 'dateformat'
import { List, Popup, Image, Label } from 'semantic-ui-react'
import { getAvatarUrl } from '../../utils/avatar'
import './index.css'

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

const voteNormaliser = (v: number) => Math.round(v / 10 - 5) // 100 is max a user can vote per play

const votedByContent = (votes: Vote[]) => (
  <List>
    {votes.map((data, i) => {
      const fullName = data.user ? data.user.fullname : 'User unknown'
      const voteScore = (
        <Label circular size='mini'>
          {voteNormaliser(data.vote)}
        </Label>
      )

      return (
        <List.Item key={i}>
          {userPicture(data)}
          <List.Content>
            <List.Description>
              <strong>{dateFormat(data.at, 'dd mmm yyyy @ h:MM tt')}</strong> - {fullName}{' '}
              {voteScore}
            </List.Description>
          </List.Content>
        </List.Item>
      )
    })}
  </List>
)

const userPicture = (data: Vote) => {
  if (data && data.user) {
    const avatarUrl = getAvatarUrl(data.user, 50)
    return <Image avatar className='voted_by_avatar_image' src={avatarUrl} />
  }
  return null
}

const voteLabel = ({ total, size, ribbon }: { total: number; size?: string; ribbon?: boolean }) => {
  let basic = true
  let color: 'grey' | 'green' | 'red' = 'grey'
  let icon: 'thumbs up' | 'thumbs down' = 'thumbs up'
  const normalisedTotal = voteNormaliser(total)

  if (normalisedTotal < 0) icon = 'thumbs down'
  if (normalisedTotal > 4) {
    color = 'green'
    basic = false
  }
  if (normalisedTotal < -4) {
    color = 'red'
    basic = false
  }

  return (
    <Label
      className='track-label vote-track-label'
      size={(size as any) || 'tiny'}
      color={color}
      basic={basic}
      icon={icon}
      content={normalisedTotal}
      ribbon={ribbon ? 'right' : undefined}
    />
  )
}

const VotedBy: React.FC<VotedByProps> = ({ show, ribbon, votes = [], total, size }) => {
  const voteCount = votes.length
  if (!show) return null
  if (voteCount < 1) return voteLabel({ total, size, ribbon })

  return (
    <Popup
      wide='very'
      content={votedByContent(votes)}
      trigger={voteLabel({ total, size, ribbon })}
    />
  )
}

export default VotedBy

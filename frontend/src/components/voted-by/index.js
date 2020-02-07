import React from 'react'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { List, Popup, Image, Label } from 'semantic-ui-react'
import './index.css'

const voteNormaliser = (v) => Math.round((v / 10) - 5) // 100 is max a user can vote per play

const votedByContent = (votes) => (
  <List>
    {
      votes.map((data, i) => {
        const fullName = data.user ? data.user.fullname : 'User unknown'
        const voteScore = <Label circular size='mini'>{voteNormaliser(data.vote)}</Label>

        return (
          <List.Item key={i}>
            {userPicture(data)}
            <List.Content>
              <List.Description>
                <strong>{dateFormat(data.at, 'dd mmm yyyy @ h:MM tt')}</strong> - {fullName} {voteScore}
              </List.Description>
            </List.Content>
          </List.Item>
        )
      })
    }
  </List>
)

const userPicture = data => {
  if (data && data.user && data.user.picture) return <Image avatar className='voted_by_avatar_image' src={data.user.picture} />
  return null
}

const voteLabel = (total, ribbon) => {
  let color = 'green'
  let icon = 'thumbs up'
  const normalisedTotal = voteNormaliser(total)

  if (normalisedTotal < 0) icon = 'thumbs down'
  if (normalisedTotal < 0) color = 'red'

  return (
    <Label
      className='track-label vote-track-label'
      size='tiny'
      color={color}
      icon={icon}
      content={normalisedTotal}
      ribbon={ribbon ? 'right' : null}
    />
  )
}

const VotedBy = ({ total, votes, ribbon }) => {
  const voteCount = votes ? votes.length : 0
  if (total < 1) return null
  if (voteCount < 1) return voteLabel(total, ribbon)

  return (
    <Popup
      wide='very'
      content={votedByContent(votes)}
      trigger={voteLabel(total, ribbon)}
    />
  )
}

VotedBy.propTypes = {
  ribbon: PropTypes.bool,
  votes: PropTypes.array,
  total: PropTypes.number.isRequired
}

export default VotedBy

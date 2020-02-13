import React from 'react'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { List, Popup, Image, Label } from 'semantic-ui-react'
import './index.css'

const voteNormaliser = (v) => Math.round((v / 10) - 5) // 100 is max a user can vote per play

const votedByContent = (props) => (
  <List>
    {
      props.votes.map((data, i) => {
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

const voteLabel = (props) => {
  let color = 'green'
  let icon = 'thumbs up'
  const normalisedTotal = voteNormaliser(props.total)

  if (normalisedTotal < 0) icon = 'thumbs down'
  if (normalisedTotal < 0) color = 'red'

  return (
    <Label
      className='track-label vote-track-label'
      size={props.size || 'tiny'}
      color={color}
      icon={icon}
      content={normalisedTotal}
      ribbon={props.ribbon ? 'right' : null}
    />
  )
}

const VotedBy = (props) => {
  const voteCount = props.votes ? props.votes.length : 0
  if (!props.total || props.total < 1) return null
  if (voteCount < 1) return voteLabel(props)

  return (
    <Popup
      wide='very'
      content={votedByContent(props)}
      trigger={voteLabel(props)}
    />
  )
}

VotedBy.propTypes = {
  ribbon: PropTypes.bool,
  votes: PropTypes.array,
  total: PropTypes.number,
  size: PropTypes.string
}

export default VotedBy

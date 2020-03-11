import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Label, Icon } from 'semantic-ui-react'
import Slider from 'rc-slider'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import ProgressBar from 'components/progress-bar'
import defaultImage from './default-artwork.png'
import { flatten, mean } from 'lodash'
import 'rc-slider/assets/index.css'
import './styles.scss'

const marks = {
  0: {
    style: {
      color: 'red'
    },
    label: <Icon name='thumbs down' color='red' />
  },
  50: <Icon name='handshake' />,
  100: {
    style: {
      color: 'green'
    },
    label: <Icon name='thumbs up' color='green' />
  }
}

const spotifyLink = uri => {
  const code = uri.split(':').pop()
  return `https://open.spotify.com/track/${code}`
}

const AlbumDescription = props => {
  const year = ` (${props.album.year})`
  return <p>{props.album.name}{year}</p>
}

const noTrack = () => (
  <div className="c-nowPlaying">
    <img src={defaultImage} />
    <Card.Content>
      <Card.Header>Nothing playing</Card.Header>
      <Card.Description>Drag some music here or press play.</Card.Description>
    </Card.Content>
  </div>
)

const calcVoteAverage = data => {
  const votes = data.map(i => i.vote)
  if (votes.length < 1) return 0
  return mean(flatten(votes))
}

const voteHandleColor = total => {
  if (total > 50) return '#21ba45'
  if (total < 50) return 'red'
  return 'gray'
}

const TrackVotes = props => {
  if (!props.metrics) return null
  return <VotedBy total={props.metrics.votesAverage} show={props.metrics.votes > 0} ribbon />
}

const AddLabel = props => {
  return (
    <Label size='mini'>
      Added
      <Label.Detail>{props.count}</Label.Detail>
    </Label>
  )
}

const PlayLabel = props => {
  if (!props.metrics) return null

  return (
    <Label size='mini'>
      Played
      <Label.Detail>{props.metrics.plays}</Label.Detail>
    </Label>
  )
}

const VoteLabel = props => {
  if (!props.metrics) return null

  return (
    <Label size='mini'>
      Activity
      <Label.Detail>{props.metrics.votes}</Label.Detail>
    </Label>
  )
}

const CurrentTrack = props => {
  const { track, onVote, userID } = props
  if (!track) {
    return noTrack()
  }
  const maxRating = 10
  const { addedBy = [] } = track
  const votes = (addedBy[0] && addedBy[0].votes) || []
  const currentUserVoter = votes.find(u => u.user._id === userID)
  const currentUserVote = currentUserVoter ? currentUserVoter.vote : null
  const doVote = uri => rating => onVote(uri, rating / maxRating)

  return (
    <div className="c-nowPlaying">
      <img
        src={track.image || defaultImage}
        //label={<TrackVotes metrics={track.metrics} />}
      />
      <div className="c-nowPlaying__trackInfo">
        <h6>Now playing</h6>
        <h4>{track.name}</h4>
        <p>{track.artist.name}</p>
        <AlbumDescription album={track.album} />
        <ProgressBar />
      </div>
      <Card.Content extra>
        <div className='track-rating-container'>
          <Slider
            disabled={!userID}
            dots
            value={currentUserVote}
            included={false}
            marks={marks}
            step={maxRating}
            onChange={doVote(track.uri)}
            handleStyle={{
              borderColor: voteHandleColor(currentUserVote),
              backgroundColor: voteHandleColor(currentUserVote)
            }}
          />
        </div>
      </Card.Content>
      <Card.Content extra>
        <AddLabel count={addedBy.length} />
        <PlayLabel metrics={track.metrics} />
        <VoteLabel metrics={track.metrics} />
        <VotedBy size='mini' show={votes.length > 0} total={calcVoteAverage(votes)} votes={votes} />
      </Card.Content>
      <Card.Content extra>
        <AddedBy users={track.addedBy} />
        <a
          className='track-uri'
          href={spotifyLink(track.uri)}
          target='_blank'
          rel='noopener noreferrer'
        >
          {track.uri}
        </a>
      </Card.Content>
    </div>
  )
}

CurrentTrack.propTypes = {
  userID: PropTypes.string,
  track: PropTypes.object,
  onVote: PropTypes.func
}

export default CurrentTrack

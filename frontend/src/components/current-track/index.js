import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Label, Rating } from 'semantic-ui-react'
import { Line } from 'rc-progress'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import defaultImage from './default-artwork.png'
import { sumBy } from 'lodash'
import { millisToMinutesAndSeconds } from 'utils/time'
import './index.css'

const spotifyLink = (uri) => {
  const code = uri.split(':').pop()
  return `https://open.spotify.com/track/${code}`
}

const albumDescription = album => {
  if (!album) return null
  const year = album.year ? ` (${album.year})` : null
  return <Card.Description>{album.name}{year}</Card.Description>
}

const noTrack = () => (
  <Card>
    <Image src={defaultImage} />
    <Card.Content>
      <Card.Header>Nothing playing</Card.Header>
      <Card.Description>Drag some music here or press play.</Card.Description>
    </Card.Content>
  </Card>
)

const CurrentTrack = (props) => {
  const { track, progress, remaining, onVote, userID } = props
  if (!track) { return noTrack() }
  const maxRating = 10
  const { addedBy = [] } = track
  const votes = (addedBy[0] && addedBy[0].votes) || []
  const playCount = track.metrics.plays
  const averageVote = track.metrics.votesAverage
  const currentUserVoter = votes.find(u => u.user._id === userID)
  const currentUserVote = currentUserVoter ? (currentUserVoter.vote / maxRating) : 0
  const doVote = (uri) => (_, data) => onVote(uri, data.rating)
  const liveVoteScore = sumBy(votes, v => v.vote)

  return (
    <Card>
      <Image
        src={track.image || defaultImage}
        label={<VotedBy total={averageVote} ribbon />}
      />
      <Card.Content>
        <div className='progress-container'>
          <span className='remaining-text'>{millisToMinutesAndSeconds(remaining)}</span>
          <span className='track-length'>{millisToMinutesAndSeconds(track.length)}</span>
          <Line percent={progress} />
        </div>
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>{track.artist.name}</Card.Meta>
        { albumDescription(track.album) }
      </Card.Content>
      <Card.Content className='rating-container' extra>
        <Rating
          disabled={!userID}
          maxRating={maxRating}
          rating={currentUserVote}
          onRate={doVote(track.uri)}
        />
        <VotedBy total={liveVoteScore} votes={votes} />
      </Card.Content>
      <Card.Content extra>
        <Label size='mini'>
          Added
          <Label.Detail>{addedBy.length}</Label.Detail>
        </Label>
        <Label size='mini'>
          Played
          <Label.Detail>{playCount}</Label.Detail>
        </Label>
      </Card.Content>
      <Card.Content extra>
        <AddedBy users={track.addedBy} />
        <a
          className='track-uri'
          href={spotifyLink(track.uri)}
          target='_blank'
          rel='noopener noreferrer'
        >{track.uri}</a>
      </Card.Content>
    </Card>
  )
}

CurrentTrack.propTypes = {
  userID: PropTypes.string,
  track: PropTypes.object,
  progress: PropTypes.number,
  remaining: PropTypes.number,
  onVote: PropTypes.func
}

export default CurrentTrack

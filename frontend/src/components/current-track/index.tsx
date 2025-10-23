import React from 'react'
import { Card, Image, Label, Icon } from 'semantic-ui-react'
import Slider from 'rc-slider'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import ProgressBar from 'components/progress-bar'
import defaultImage from './default-artwork.png'
import { flatten, mean } from 'lodash'
import 'rc-slider/assets/index.css'
import './index.css'

interface User {
  _id: string
  picture?: string
  fullname?: string
  email?: string
}

interface Vote {
  user: User
  vote: number
  at: string
}

interface Artist {
  name: string
}

interface Album {
  name: string
  year?: number
}

interface TrackMetrics {
  plays: number
  votes: number
  votesAverage: number
}

interface AddedByData {
  user?: User
  addedAt: string
  votes?: Vote[]
}

interface Track {
  uri: string
  name: string
  artist?: Artist
  album?: Album
  image?: string
  addedBy?: AddedByData[]
  metrics?: TrackMetrics
}

interface CurrentTrackProps {
  userID?: string
  track?: Track
  onVote?: (uri: string, rating: number) => void
}

const marks: Record<number, any> = {
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

const spotifyLink = (uri: string) => {
  const code = uri.split(':').pop()
  return `https://open.spotify.com/track/${code}`
}

const AlbumDescription: React.FC<{ album?: Album }> = ({ album }) => {
  if (!album) return null
  const year = album.year ? ` (${album.year})` : ''
  return (
    <Card.Description>
      {album.name}
      {year}
    </Card.Description>
  )
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

const calcVoteAverage = (data: Vote[]) => {
  const votes = data.map(i => i.vote)
  if (votes.length < 1) return 0
  return mean(flatten(votes))
}

const voteHandleColor = (total: number | null) => {
  if (total === null) return 'gray'
  if (total > 50) return '#21ba45'
  if (total < 50) return 'red'
  return 'gray'
}

const TrackVotes: React.FC<{ metrics?: TrackMetrics }> = ({ metrics }) => {
  if (!metrics) return null
  return <VotedBy total={metrics.votesAverage} show={metrics.votes > 0} ribbon />
}

const AddLabel: React.FC<{ count: number }> = ({ count }) => {
  return (
    <Label size='mini'>
      Added
      <Label.Detail>{count}</Label.Detail>
    </Label>
  )
}

const PlayLabel: React.FC<{ metrics?: TrackMetrics }> = ({ metrics }) => {
  if (!metrics) return null

  return (
    <Label size='mini'>
      Played
      <Label.Detail>{metrics.plays}</Label.Detail>
    </Label>
  )
}

const VoteLabel: React.FC<{ metrics?: TrackMetrics }> = ({ metrics }) => {
  if (!metrics) return null

  return (
    <Label size='mini'>
      Activity
      <Label.Detail>{metrics.votes}</Label.Detail>
    </Label>
  )
}

const CurrentTrack: React.FC<CurrentTrackProps> = ({ track, onVote, userID }) => {
  if (!track || !track.name) {
    return noTrack()
  }
  const maxRating = 10
  const { addedBy = [] } = track
  const votes = (addedBy[0] && addedBy[0].votes) || []
  const currentUserVoter = votes.find(u => u.user._id === userID)
  const currentUserVote = currentUserVoter ? currentUserVoter.vote : null
  const doVote = (uri: string) => (rating: number) => onVote?.(uri, rating / maxRating)

  return (
    <Card>
      <Image src={track.image || defaultImage} label={<TrackVotes metrics={track.metrics} />} />
      <Card.Content>
        <ProgressBar />
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>{track.artist && track.artist.name}</Card.Meta>
        <AlbumDescription album={track.album} />
      </Card.Content>
      <Card.Content extra>
        <div className='track-rating-container'>
          <Slider
            disabled={!userID}
            dots
            value={currentUserVote ?? undefined}
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
    </Card>
  )
}

export default CurrentTrack

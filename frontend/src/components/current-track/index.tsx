import React from 'react'
import { Icon } from 'components/ui/icon'
import { Slider } from 'components/ui/slider'
import { Badge } from 'components/ui/badge'
import { Card, CardContent } from 'components/ui/card'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import ProgressBar from 'components/progress-bar'
import defaultImage from './default-artwork.png'
import { flatten, mean } from 'lodash'
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

const spotifyLink = (uri: string) => {
  const code = uri.split(':').pop()
  return `https://open.spotify.com/track/${code}`
}

const AlbumDescription: React.FC<{ album?: Album }> = ({ album }) => {
  if (!album) return null
  const year = album.year ? ` (${album.year})` : ''
  return (
    <p className='text-sm text-muted-foreground'>
      {album.name}
      {year}
    </p>
  )
}

const noTrack = () => (
  <Card className='overflow-hidden'>
    <div className='relative'>
      <img src={defaultImage} alt='No track playing' className='w-full h-auto' />
    </div>
    <CardContent className='p-6'>
      <h3 className='text-xl font-semibold mb-2'>Nothing playing</h3>
      <p className='text-sm text-muted-foreground'>Drag some music here or press play.</p>
    </CardContent>
  </Card>
)

const calcVoteAverage = (data: Vote[]) => {
  const votes = data.map(i => i.vote)
  if (votes.length < 1) return 0
  return mean(flatten(votes))
}

const voteHandleColor = (total: number | null) => {
  if (total === null) return 'hsl(var(--muted-foreground))'
  if (total > 50) return '#21ba45'
  if (total < 50) return '#ef4444'
  return 'hsl(var(--muted-foreground))'
}

const TrackVotes: React.FC<{ metrics?: TrackMetrics }> = ({ metrics }) => {
  if (!metrics) return null
  return (
    <div className='absolute top-0 right-0'>
      <VotedBy total={metrics.votesAverage} show={metrics.votes > 0} ribbon />
    </div>
  )
}

const AddLabel: React.FC<{ count: number }> = ({ count }) => {
  return (
    <Badge variant='secondary' className='text-xs'>
      Added <span className='ml-1 font-bold'>{count}</span>
    </Badge>
  )
}

const PlayLabel: React.FC<{ metrics?: TrackMetrics }> = ({ metrics }) => {
  if (!metrics) return null

  return (
    <Badge variant='secondary' className='text-xs'>
      Played <span className='ml-1 font-bold'>{metrics.plays}</span>
    </Badge>
  )
}

const VoteLabel: React.FC<{ metrics?: TrackMetrics }> = ({ metrics }) => {
  if (!metrics) return null

  return (
    <Badge variant='secondary' className='text-xs'>
      Activity <span className='ml-1 font-bold'>{metrics.votes}</span>
    </Badge>
  )
}

const SliderMarks: React.FC<{ disabled?: boolean }> = () => (
  <div className='relative w-full h-6 mt-2 pointer-events-none'>
    <div className='absolute left-0 flex flex-col items-center' style={{ marginLeft: '-12px' }}>
      <Icon name='thumbs down' size='small' className='text-red-500' />
    </div>
    <div className='absolute left-1/2 flex flex-col items-center' style={{ marginLeft: '-12px' }}>
      <Icon name='handshake' size='small' className='text-muted-foreground' />
    </div>
    <div className='absolute right-0 flex flex-col items-center' style={{ marginRight: '-12px' }}>
      <Icon name='thumbs up' size='small' className='text-green-500' />
    </div>
  </div>
)

const CurrentTrack: React.FC<CurrentTrackProps> = ({ track, onVote, userID }) => {
  if (!track || !track.name) {
    return noTrack()
  }

  const { addedBy = [] } = track
  const votes = (addedBy[0] && addedBy[0].votes) || []
  const currentUserVoter = votes.find(u => u.user._id === userID)
  const currentUserVote = currentUserVoter ? currentUserVoter.vote : null

  const handleValueChange = (value: number[]) => {
    if (onVote && value.length > 0) {
      onVote(track.uri, value[0] / 100)
    }
  }

  // Convert 0-10 scale to 0-100 for the slider
  const sliderValue = currentUserVote !== null ? currentUserVote * 10 : 50

  return (
    <Card className='overflow-hidden'>
      <div className='relative'>
        <img
          src={track.image || defaultImage}
          alt={`${track.name} artwork`}
          className='w-full h-auto'
        />
        <TrackVotes metrics={track.metrics} />
      </div>

      <CardContent className='p-6 pb-0'>
        <ProgressBar />
        <h3 className='text-xl font-semibold mt-2 mb-1'>{track.name}</h3>
        <p className='text-sm text-muted-foreground font-medium mb-1'>
          {track.artist && track.artist.name}
        </p>
        <AlbumDescription album={track.album} />
      </CardContent>

      <CardContent className='px-6 py-4'>
        <div className='track-rating-container mx-auto'>
          <Slider
            disabled={!userID}
            value={[sliderValue]}
            min={0}
            max={100}
            step={10}
            onValueChange={handleValueChange}
            className='mb-2'
            style={
              {
                '--thumb-color': voteHandleColor(currentUserVote)
              } as React.CSSProperties
            }
          />
          <SliderMarks disabled={!userID} />
        </div>
      </CardContent>

      <CardContent className='px-6 py-3 border-t'>
        <div className='flex items-center gap-2 flex-wrap'>
          <AddLabel count={addedBy.length} />
          <PlayLabel metrics={track.metrics} />
          <VoteLabel metrics={track.metrics} />
          <VotedBy
            size='mini'
            show={votes.length > 0}
            total={calcVoteAverage(votes)}
            votes={votes}
          />
        </div>
      </CardContent>

      <CardContent className='px-6 py-3 border-t'>
        <div className='flex items-center justify-between'>
          <AddedBy users={track.addedBy} />
          <a
            className='track-uri text-xs font-bold text-muted-foreground hover:text-foreground transition-colors'
            href={spotifyLink(track.uri)}
            target='_blank'
            rel='noopener noreferrer'
          >
            {track.uri}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentTrack

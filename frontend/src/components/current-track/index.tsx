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
  <Card className='overflow-hidden shadow-xl border-border/50 rounded-2xl bg-gradient-to-br from-card to-muted/20'>
    <div className='relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
      <img src={defaultImage} alt='No track playing' className='w-full h-auto opacity-80' />
    </div>
    <CardContent className='p-8 text-center'>
      <h3 className='text-2xl font-bold mb-3 text-foreground'>Nothing playing</h3>
      <p className='text-base text-muted-foreground mb-4'>Add some music to get started</p>
      <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
          />
        </svg>
        <span>Search for tracks or press play</span>
      </div>
    </CardContent>
  </Card>
)

const calcVoteAverage = (data: Vote[]) => {
  const votes = data.map(i => i.vote)
  if (votes.length < 1) return 0
  return mean(flatten(votes))
}

const voteHandleColor = (rating: number | null) => {
  if (rating === null) return 'hsl(var(--muted-foreground))'
  // Rating is on 0-10 scale: 0-4 = negative (red), 5 = neutral, 6-10 = positive (green)
  if (rating > 5) return '#21ba45'
  if (rating < 5) return '#ef4444'
  return 'hsl(var(--muted-foreground))'
}

const getRatingGradient = (rating: number | null) => {
  if (rating === null)
    return 'linear-gradient(to right, #ef4444 0%, hsl(var(--muted)) 50%, #21ba45 100%)'

  // Rating is on 0-10 scale where 5 is neutral (50% position)
  const position = (rating / 10) * 100

  if (rating < 5) {
    return `linear-gradient(to right, #ef4444 0%, #f87171 ${position}%, hsl(var(--muted)) 50%, hsl(var(--muted)) 100%)`
  } else if (rating > 5) {
    return `linear-gradient(to right, hsl(var(--muted)) 0%, hsl(var(--muted)) 50%, #4ade80 ${position}%, #21ba45 100%)`
  }
  return 'linear-gradient(to right, #ef4444 0%, hsl(var(--muted)) 50%, #21ba45 100%)'
}

const getRatingLabel = (rating: number | null) => {
  if (rating === null) return 'No rating'
  // Convert 0-10 scale to -5 to +5 for display
  const displayRating = rating !== null ? rating - 5 : 0
  if (displayRating === 0) return '0'
  const sign = displayRating > 0 ? '+' : ''
  return `${sign}${displayRating}`
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
  <div className='relative w-full h-8 mt-3 pointer-events-none flex justify-between'>
    <div className='flex flex-col items-center' style={{ marginLeft: '-6px' }}>
      <Icon name='thumbs down' size='small' className='text-red-500 opacity-80' />
      <span className='text-xs font-semibold text-red-500 mt-1'>-5</span>
    </div>
    <div className='flex flex-col items-center'>
      <Icon name='handshake' size='small' className='text-muted-foreground opacity-80' />
      <span className='text-xs font-semibold text-muted-foreground mt-1'>0</span>
    </div>
    <div className='flex flex-col items-center' style={{ marginRight: '-6px' }}>
      <Icon name='thumbs up' size='small' className='text-green-500 opacity-80' />
      <span className='text-xs font-semibold text-green-500 mt-1'>+5</span>
    </div>
  </div>
)

const CurrentTrack: React.FC<CurrentTrackProps> = ({ track, onVote, userID }) => {
  if (!track || !track.name) {
    return noTrack()
  }

  const { addedBy = [] } = track
  const votes = (addedBy[0] && addedBy[0].votes) || []

  // Serialize votes array to detect deep changes
  const votesKey = React.useMemo(() => JSON.stringify(votes), [votes])

  // Use useMemo to properly track derived values and prevent render bailout
  const currentUserVote = React.useMemo(() => {
    const voter = votes.find(u => u.user._id === userID)
    return voter ? voter.vote : null
  }, [votesKey, userID])

  // Backend stores and returns votes on 0-10 scale (0=-5, 5=0, 10=+5)
  // Slider also works on 0-10 scale internally
  const currentRating = React.useMemo(() => {
    return currentUserVote !== null ? Math.round(currentUserVote) : null
  }, [currentUserVote])

  // Local state for slider value (0-10 scale)
  const [sliderValue, setSliderValue] = React.useState<number[]>([currentRating ?? 5])

  // Update slider when currentRating changes OR when track changes
  React.useEffect(() => {
    setSliderValue([currentRating ?? 5])
  }, [currentRating, track.uri, votesKey])

  const handleValueChange = (value: number[]) => {
    setSliderValue(value)
  }

  const handleValueCommit = (value: number[]) => {
    if (onVote && value.length > 0) {
      // Slider value is already on 0-10 scale, convert to 0-1 for backend
      const rating = value[0]
      const vote = rating / 10

      onVote(track.uri, vote)
    }
  }

  return (
    <Card className='overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-border/50 rounded-2xl bg-gradient-to-br from-card to-card/95'>
      <div className='relative group overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'></div>
        <img
          src={track.image || defaultImage}
          alt={`${track.name} artwork`}
          className='w-full h-auto current-track-image transform group-hover:scale-105 transition-transform duration-500'
        />
        <TrackVotes metrics={track.metrics} />
      </div>

      <CardContent className='p-6 pb-4 track-content bg-gradient-to-b from-transparent to-muted/5'>
        <ProgressBar />
        <h3 className='text-2xl font-bold mt-3 mb-2 transition-colors hover:text-primary leading-tight'>
          {track.name}
        </h3>
        <p className='text-base text-muted-foreground font-semibold mb-1 transition-colors hover:text-foreground'>
          {track.artist && track.artist.name}
        </p>
        <AlbumDescription album={track.album} />
      </CardContent>

      <CardContent className='px-6 py-5 card-section bg-gradient-to-br from-muted/5 to-muted/20'>
        <div className='track-rating-container mx-auto'>
          <div className='mb-4 text-center'>
            <div className='flex items-center justify-center gap-2'>
              <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                Rate This Track
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-all duration-300 ${
                  sliderValue[0] === 5
                    ? 'bg-muted/50 text-muted-foreground'
                    : sliderValue[0] > 5
                      ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                      : 'bg-red-500/20 text-red-700 dark:text-red-400'
                }`}
              >
                {getRatingLabel(sliderValue[0])}
              </span>
            </div>
          </div>
          <div className='relative'>
            <Slider
              disabled={!userID}
              value={sliderValue}
              min={0}
              max={10}
              step={1}
              onValueChange={handleValueChange}
              onValueCommit={handleValueCommit}
              className='mb-2'
              style={
                {
                  '--thumb-color': voteHandleColor(sliderValue[0]),
                  '--track-gradient': getRatingGradient(sliderValue[0])
                } as React.CSSProperties
              }
            />
            <SliderMarks disabled={!userID} />
          </div>
        </div>
      </CardContent>

      <CardContent className='px-6 py-4 border-t border-border/50 card-section'>
        <div className='flex items-center gap-2 flex-wrap justify-center'>
          <div className='track-badge'>
            <AddLabel count={addedBy.length} />
          </div>
          <div className='track-badge'>
            <PlayLabel metrics={track.metrics} />
          </div>
          <div className='track-badge'>
            <VoteLabel metrics={track.metrics} />
          </div>
          <VotedBy
            size='mini'
            show={votes.length > 0}
            total={calcVoteAverage(votes)}
            votes={votes}
          />
        </div>
      </CardContent>

      <CardContent className='px-6 py-4 border-t border-border/50 card-section bg-muted/5'>
        <div className='flex items-center justify-between gap-3 flex-wrap'>
          <AddedBy users={track.addedBy} />
          <a
            className='track-uri text-xs font-bold text-muted-foreground hover:text-primary transition-all hover:underline inline-flex items-center gap-1'
            href={spotifyLink(track.uri)}
            target='_blank'
            rel='noopener noreferrer'
          >
            <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
            </svg>
            {track.uri}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentTrack

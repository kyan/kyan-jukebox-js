import React from 'react'
import { Icon } from 'components/ui/icon'
import { Slider } from 'components/ui/slider'
import { Card, CardContent } from 'components/ui/card'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import ProgressBar from 'components/progress-bar'
import defaultImage from './default-artwork.png'
import { cn } from '@/lib/utils'

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
    <p className='current-track-album'>
      {album.name}
      {year}
    </p>
  )
}

const noTrack = () => (
  <Card className='current-track-empty'>
    <div className='current-track-empty-artwork'>
      <div className='current-track-empty-overlay'></div>
      <img src={defaultImage} alt='No track playing' className='current-track-empty-image' />
    </div>
    <CardContent className='current-track-empty-content'>
      <h3 className='current-track-empty-title'>Nothing playing</h3>
      <p className='current-track-empty-description'>Add some music to get started</p>
      <div className='current-track-empty-hint'>
        <svg
          className='current-track-empty-icon'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
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

const TrackVotes: React.FC<{ metrics?: TrackMetrics; votes: Vote[] }> = ({ metrics, votes }) => {
  if (!metrics) return null
  return (
    <div className='current-track-votes'>
      <VotedBy
        total={metrics.votesAverage}
        show={metrics.votes > 0}
        ribbon
        size='small'
        votes={votes}
      />
    </div>
  )
}

const SliderMarks: React.FC<{ disabled?: boolean }> = () => (
  <div className='track-rating-marks'>
    <div className='track-rating-mark track-rating-mark--negative'>
      <Icon name='thumbs down' size='small' className='track-rating-mark-icon text-red-500' />
      <span className='track-rating-mark-label text-red-500'>-5</span>
    </div>
    <div className='track-rating-mark'>
      <Icon
        name='handshake'
        size='small'
        className='track-rating-mark-icon text-muted-foreground'
      />
      <span className='track-rating-mark-label text-muted-foreground'>0</span>
    </div>
    <div className='track-rating-mark track-rating-mark--positive'>
      <Icon name='thumbs up' size='small' className='track-rating-mark-icon text-green-500' />
      <span className='track-rating-mark-label text-green-500'>+5</span>
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
    <Card className='current-track-card'>
      <div className='current-track-artwork'>
        <div className='current-track-artwork-overlay'></div>
        <img
          src={track.image || defaultImage}
          alt={`${track.name} artwork`}
          className='current-track-image'
        />
        <TrackVotes metrics={track.metrics} votes={votes} />
      </div>

      <CardContent className='current-track-content'>
        <div className='current-track-progress'>
          <ProgressBar />
        </div>
        <div className='current-track-info'>
          <h3 className='current-track-title'>{track.name}</h3>
          {track.artist && <p className='current-track-artist'>{track.artist.name}</p>}
          <AlbumDescription album={track.album} />
        </div>
      </CardContent>

      <CardContent className='current-track-rating-section'>
        <div className='track-rating-container'>
          <div className='track-rating-header'>
            <div className='track-rating-label-wrapper'>
              <span className='track-rating-label'>Rate This Track</span>
              <span
                className={cn(
                  'track-rating-value',
                  sliderValue[0] === 5
                    ? 'track-rating-value--neutral'
                    : sliderValue[0] > 5
                      ? 'track-rating-value--positive'
                      : 'track-rating-value--negative'
                )}
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

      <CardContent className='current-track-metadata'>
        <div className='current-track-stats-grid'>
          <div className='stat-item'>
            <div className='stat-icon'>
              <Icon name='user' size='small' />
            </div>
            <div className='stat-content'>
              <span className='stat-value'>{addedBy.length}</span>
              <span className='stat-label'>Added</span>
            </div>
          </div>
          <div className='stat-item'>
            <div className='stat-icon'>
              <Icon name='play' size='small' />
            </div>
            <div className='stat-content'>
              <span className='stat-value'>{track.metrics?.plays || 0}</span>
              <span className='stat-label'>Plays</span>
            </div>
          </div>
          <div className='stat-item'>
            <div className='stat-icon'>
              <Icon name='heart' size='small' />
            </div>
            <div className='stat-content'>
              <span className='stat-value'>{track.metrics?.votes || 0}</span>
              <span className='stat-label'>Activity</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardContent className='current-track-footer'>
        <div className='current-track-footer-content'>
          <div className='footer-section'>
            <span className='footer-label'>Added by</span>
            <AddedBy users={track.addedBy} />
          </div>
          <a
            className='track-spotify-link'
            href={spotifyLink(track.uri)}
            target='_blank'
            rel='noopener noreferrer'
            title='Open in Spotify'
          >
            <svg className='spotify-icon' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
            </svg>
            <span className='spotify-text'>Open in Spotify</span>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentTrack

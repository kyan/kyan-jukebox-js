import React from 'react'
import { cn } from '@/lib/utils'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import RemoveTrack from 'components/remove-track'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface User {
  _id: string
  fullname?: string
}

interface Artist {
  name: string
}

interface TrackMetrics {
  plays: number
  votes: number
  votesAverage: number
}

interface AddedByData {
  user?: User
  addedAt: string
  votes?: any[]
}

interface Track {
  uri: string
  name: string
  artist: Artist
  image?: string
  length: number
  addedBy: AddedByData[]
  metrics?: TrackMetrics
}

interface TracklistProps {
  disabled?: boolean
  tracks?: Track[]
  currentTrack?: Track
  onRemoveTrack: (uri: string) => void
  onArtistSearch: (artistName: string) => () => void
}

interface TrackImageProps {
  src: string
  isCurrent: boolean
}

interface ImageChooserProps {
  image?: string
  isCurrent: boolean
}

interface TrackHeadingProps {
  name: string
}

interface TrackDescriptionProps {
  artistName: string
  trackLength: number
  onClick: () => void
}

interface CurrentVoteProps {
  metrics?: TrackMetrics
}

interface ActionRemoveProps {
  uri: string
  name: string
  disabled?: boolean
  isCurrent: boolean
  onClick: (uri: string) => void
}

interface CurrentPlaysProps {
  metrics?: TrackMetrics
}

interface ListItemsProps {
  disabled?: boolean
  tracks: Track[]
  current?: Track
  onRemove: (uri: string) => void
  onArtistSearch: (artistName: string) => () => void
}

const TrackImage: React.FC<TrackImageProps> = ({ src, isCurrent }) => (
  <Avatar
    className={cn(
      'h-[80px] w-[80px] rounded-xl shadow-md transition-all duration-300',
      isCurrent && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
    )}
  >
    <AvatarImage src={src} alt='Track artwork' className='object-cover' />
    <AvatarFallback className='rounded-xl'>
      <img src={defaultImage} alt='Default artwork' />
    </AvatarFallback>
  </Avatar>
)

const ImageChooser: React.FC<ImageChooserProps> = ({ image, isCurrent }) => {
  const imageSrc = image ? image : defaultImage
  return <TrackImage src={imageSrc} isCurrent={isCurrent} />
}

const TrackHeading: React.FC<TrackHeadingProps> = ({ name }) => (
  <h3 className='text-base font-bold leading-tight mb-1.5 text-foreground hover:text-primary transition-colors'>
    {name}
  </h3>
)

const TrackDescription: React.FC<TrackDescriptionProps> = ({
  artistName,
  trackLength,
  onClick
}) => (
  <div className='text-sm text-muted-foreground flex items-center gap-2'>
    <button
      type='button'
      onClick={onClick}
      className='hover:text-foreground hover:underline transition-colors cursor-pointer inline-block font-medium'
    >
      {artistName}
    </button>
    <span className='text-muted-foreground/50'>•</span>
    <span className='text-xs text-muted-foreground/70 font-medium'>
      {millisToMinutesAndSeconds(trackLength)}
    </span>
  </div>
)

const CurrentVote: React.FC<CurrentVoteProps> = ({ metrics }) => {
  if (!metrics) return null
  const show = metrics.votes > 0
  if (!show) return null

  return (
    <div className='inline-flex items-center'>
      <VotedBy total={metrics.votesAverage} show={show} />
    </div>
  )
}

const ActionRemove: React.FC<ActionRemoveProps> = ({ uri, name, disabled, isCurrent, onClick }) => {
  if (isCurrent || disabled) return null
  const removeTrack = (trackUri: string, cb: (uri: string) => void) => () => cb(trackUri)

  return <RemoveTrack uri={uri} name={name} onClick={removeTrack(uri, onClick)} />
}

const CurrentPlays: React.FC<CurrentPlaysProps> = ({ metrics }) => {
  if (!metrics) return null

  const hasPlays = metrics.plays > 0

  return (
    <Badge
      variant={hasPlays ? 'default' : 'outline'}
      className={cn('text-xs shadow-sm', !hasPlays && 'text-muted-foreground')}
    >
      Played <span className='ml-1 font-bold'>{metrics.plays}</span>
    </Badge>
  )
}

const ListItems: React.FC<ListItemsProps> = ({
  disabled,
  tracks,
  current,
  onRemove,
  onArtistSearch
}) => {
  let beenPlayed = false
  const isCurrentTrack = (currentTrack?: Track, uri?: string) =>
    currentTrack && currentTrack.uri === uri

  return (
    <div className='space-y-4'>
      {tracks.map((track, i) => {
        const { addedBy } = track
        const isCurrent = !!isCurrentTrack(current, track.uri)
        if (isCurrent) beenPlayed = beenPlayed || true

        return (
          <div
            key={`${i}${track.uri}`}
            className={cn(
              'flex gap-4 transition-all duration-300 p-4 rounded-xl hover:bg-accent/30',
              isCurrent &&
                'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-md',
              !beenPlayed && 'opacity-50 hover:opacity-70',
              beenPlayed && !isCurrent && 'hover:shadow-md'
            )}
          >
            <div className='flex-shrink-0'>
              <ImageChooser image={track.image} isCurrent={isCurrent} />
            </div>
            <div className='flex-1 min-w-0'>
              <TrackHeading name={track.name} />
              <TrackDescription
                artistName={track.artist.name}
                trackLength={track.length}
                onClick={onArtistSearch(track.artist.name)}
              />
              <div className='flex flex-wrap items-center gap-2 mt-3'>
                <CurrentVote metrics={track.metrics} />
                <CurrentPlays metrics={track.metrics} />
                <div className='inline-flex items-center'>
                  <AddedBy users={addedBy} />
                </div>
                <ActionRemove
                  uri={track.uri}
                  name={track.name}
                  disabled={disabled}
                  isCurrent={!!isCurrent}
                  onClick={onRemove}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const Tracklist: React.FC<TracklistProps> = ({
  disabled,
  tracks,
  currentTrack,
  onRemoveTrack,
  onArtistSearch
}) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4'>
          <svg
            className='w-8 h-8 text-muted-foreground'
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
        </div>
        <h3 className='text-lg font-semibold text-foreground mb-2'>No tracks in playlist</h3>
        <p className='text-sm text-muted-foreground'>Search and add tracks to build your queue</p>
      </div>
    )
  }

  return (
    <div>
      <ListItems
        disabled={disabled}
        tracks={tracks}
        current={currentTrack}
        onRemove={onRemoveTrack}
        onArtistSearch={onArtistSearch}
      />
    </div>
  )
}

export default Tracklist

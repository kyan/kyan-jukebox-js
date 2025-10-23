import React from 'react'
import classnames from 'classnames'
import { Comment, Label, Item } from 'semantic-ui-react'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import RemoveTrack from 'components/remove-track'
import './index.css'

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
  <Comment.Avatar className={isCurrent ? 'current-image' : undefined} src={src} />
)

const ImageChooser: React.FC<ImageChooserProps> = ({ image, isCurrent }) => {
  const imageSrc = image ? image : defaultImage
  return <TrackImage src={imageSrc} isCurrent={isCurrent} />
}

const TrackHeading: React.FC<TrackHeadingProps> = ({ name }) => (
  <Comment.Author>{name}</Comment.Author>
)

const TrackDescription: React.FC<TrackDescriptionProps> = ({
  artistName,
  trackLength,
  onClick
}) => (
  <Comment.Text>
    <Item as='a' className='track-search-link' onClick={onClick}>
      {artistName}
    </Item>{' '}
    <small>({millisToMinutesAndSeconds(trackLength)})</small>
  </Comment.Text>
)

const CurrentVote: React.FC<CurrentVoteProps> = ({ metrics }) => {
  if (!metrics) return null
  const show = metrics.votes > 0
  if (!show) return null

  return (
    <Comment.Action as='span'>
      <VotedBy total={metrics.votesAverage} show={show} />
    </Comment.Action>
  )
}

const ActionRemove: React.FC<ActionRemoveProps> = ({ uri, name, disabled, isCurrent, onClick }) => {
  if (isCurrent || disabled) return null
  const removeTrack = (trackUri: string, cb: (uri: string) => void) => () => cb(trackUri)

  return <RemoveTrack uri={uri} name={name} onClick={removeTrack(uri, onClick)} />
}

const CurrentPlays: React.FC<CurrentPlaysProps> = ({ metrics }) => {
  let basic = true
  let color: 'grey' | undefined = 'grey'
  if (!metrics) return null
  if (metrics.plays > 0) {
    basic = false
    color = undefined
  }

  return (
    <Comment.Action as='span'>
      <Label className='track-label' size='tiny' color={color} basic={basic}>
        Played <Label.Detail>{metrics.plays}</Label.Detail>
      </Label>
    </Comment.Action>
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
    <>
      {tracks.map((track, i) => {
        const { addedBy } = track
        const isCurrent = !!isCurrentTrack(current, track.uri)
        if (isCurrent) beenPlayed = beenPlayed || true

        return (
          <Comment className={classnames({ 'current-track': isCurrent })} key={`${i}${track.uri}`}>
            <ImageChooser image={track.image} isCurrent={isCurrent} />
            <Comment.Content className={classnames({ 'track-info': !beenPlayed })}>
              <TrackHeading name={track.name} />
              <TrackDescription
                artistName={track.artist.name}
                trackLength={track.length}
                onClick={onArtistSearch(track.artist.name)}
              />
              <Comment.Actions>
                <CurrentVote metrics={track.metrics} />
                <CurrentPlays metrics={track.metrics} />
                <Comment.Action>
                  <AddedBy users={addedBy} />
                </Comment.Action>
                <ActionRemove
                  uri={track.uri}
                  name={track.name}
                  disabled={disabled}
                  isCurrent={!!isCurrent}
                  onClick={onRemove}
                />
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        )
      })}
    </>
  )
}

const Tracklist: React.FC<TracklistProps> = ({
  disabled,
  tracks,
  currentTrack,
  onRemoveTrack,
  onArtistSearch
}) => {
  if (!tracks) {
    return null
  }

  return (
    <Comment.Group size='small'>
      <ListItems
        disabled={disabled}
        tracks={tracks}
        current={currentTrack}
        onRemove={onRemoveTrack}
        onArtistSearch={onArtistSearch}
      />
    </Comment.Group>
  )
}

export default Tracklist

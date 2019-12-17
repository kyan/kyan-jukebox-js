import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { List, Image } from 'semantic-ui-react'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from './added-by'
import './index.css'

const isCurrentTrack = (currentTrack, track) => {
  if (!currentTrack) return false
  return currentTrack.uri === track.uri
}

const trackImage = ({ image, isCurrent, onClick, hasBeenPlayed }) => {
  let klass, title

  if (isCurrent) klass = 'current-image'
  if (onClick && !isCurrent) {
    title = 'Click to remove from playlist'
    klass = 'remove-image'
  }

  return (
    <Image
      className={klass}
      size={hasBeenPlayed ? 'tiny' : 'mini'}
      src={image}
      title={title}
      onClick={onClick}
      inline
    />
  )
}

const removeTrack = (uri, cb) => {
  return () => cb(uri)
}

const imageChooser = (disabled, track, images, isCurrent, onRemoveTrack, hasBeenPlayed) => {
  let image
  if (images && track.album) image = images[track.album.uri]
  if (images && track.composer) image = images[track.composer.uri]
  if (!image) image = defaultImage

  return trackImage({
    image,
    hasBeenPlayed,
    isCurrent,
    onClick: (!disabled && !isCurrent) ? removeTrack(track.uri, onRemoveTrack) : undefined
  })
}

const trackHeading = (track) => (
  <List.Header as='h4'>{track.name}</List.Header>
)

const trackDescription = (track) => (
  <List.Description>
    {track.artist.name} <small>({millisToMinutesAndSeconds(track.length)})</small>
  </List.Description>
)

const addedByUsers = addedBy => addedBy.map(user => user[0])

const listItems = (disabled, tracks, images, currentTrack, onRemoveTrack) => {
  let time

  return tracks.map((track, index) => {
    const isCurrent = isCurrentTrack(currentTrack, track)
    if (time) time += track.length
    if (isCurrent) time = Date.now()

    return (
      <List.Item
        className={classnames({ 'current-track': isCurrent })}
        key={`${index}-${track.uri}`}
      >
        { imageChooser(disabled, track, images, isCurrent, onRemoveTrack, time) }
        <List.Content
          className={classnames({ 'track-info': !time })}
        >
          {trackHeading(track)}
          {trackDescription(track)}
          <AddedBy addedBy={addedByUsers(track.addedBy)} />
        </List.Content>
      </List.Item>
    )
  })
}

const Tracklist = ({ disabled, tracks, images, currentTrack, onRemoveTrack }) => {
  if (!tracks) { return null }

  return (
    <List relaxed>
      {listItems(disabled, tracks, images, currentTrack, onRemoveTrack)}
    </List>
  )
}

Tracklist.propTypes = {
  disabled: PropTypes.bool,
  tracks: PropTypes.array,
  images: PropTypes.object,
  currentTrack: PropTypes.object,
  onRemoveTrack: PropTypes.func.isRequired
}

export default Tracklist

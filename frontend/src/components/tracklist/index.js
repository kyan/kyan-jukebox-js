import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { List, Image } from 'semantic-ui-react'
import dateformat from 'dateformat'
import { millisToMinutesAndSeconds } from '../../utils/time'
import defaultImage from './../current-track/default-artwork.png'
import './index.css'

const isCurrentTrack = (currentTrack, track) => {
  if (!currentTrack) return false
  return currentTrack.uri === track.uri
}

const currentImage = (image) => (
  <Image
    className='current-image'
    size='tiny'
    src={image}
    inline
  />
)

const revealImage = (image, uri, onRemoveTrack, beenPlayed) => {
  const size = beenPlayed ? 'tiny' : 'mini'
  return (
    <Image
      className='remove-image'
      size={size}
      src={image}
      inline
      onClick={removeTrack(uri, onRemoveTrack)}
    />
  )
}

const removeTrack = (uri, cb) => {
  return () => cb(uri)
}

const imageChooser = (disabled, track, images, isCurrent, onRemoveTrack, beenPlayed) => {
  let image
  if (images && track.album) image = images[track.album.uri]
  if (images && track.composer) image = images[track.composer.uri]
  if (!image) image = defaultImage
  if (disabled) { return currentImage(image) }

  return isCurrent ? currentImage(image) : revealImage(image, track.uri, onRemoveTrack, beenPlayed)
}

const trackHeading = (track) => (
  <List.Header as='h4'>{track.name}</List.Header>
)

const trackDescription = (track) => (
  <List.Description>
    {track.artist.name} <small>({millisToMinutesAndSeconds(track.length)})</small>
  </List.Description>
)

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

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { List, Image, Reveal, Icon } from 'semantic-ui-react'
import dateformat from 'dateformat'
import { millisToMinutesAndSeconds } from '../../utils/time'
import defaultImage from './../current-track/default-artwork.png'
import './index.css'

const isCurrentTrack = (currentTrack, track) => {
  if (!currentTrack) return false
  return currentTrack.uri === track.uri
}

const currentImage = (image) => (
  <span className={trackClasses(true)}>
    <Image
      src={image}
      avatar
    />
  </span>
)

const revealImage = (image, uri, onRemoveTrack) => (
  <a
    className={trackClasses(false)}
    onClick={removeTrack(uri, onRemoveTrack)}
  >
    <Reveal animated='fade'>
      <Reveal.Content visible>
        <Image src={image} avatar />
      </Reveal.Content>
      <Reveal.Content hidden>
        <Icon
          name='close'
          color='red'
          bordered
          circular
        />
      </Reveal.Content>
    </Reveal>
  </a>
)

const trackClasses = (isCurrent) => {
  return classnames({
    'image': true,
    'current-track': isCurrent
  })
}

const removeTrack = (uri, cb) => {
  return () => {
    cb(uri)
  }
}

const imageChooser = (track, images, isCurrent, onRemoveTrack) => {
  let image
  if (images && track.album) image = images[track.album.uri]
  if (images && track.composer) image = images[track.composer.uri]
  if (!image) image = defaultImage

  return isCurrent ? currentImage(image) : revealImage(image, track.uri, onRemoveTrack)
}

const trackStartTime = (time, isCurrent) => {
  if (!time || isCurrent) return null
  return <List.Header as='h5'>{dateformat(new Date(time), 'h:MM')}</List.Header>
}

const trackHeading = (track) => (
  <List.Header as='h3'>{track.name}</List.Header>
)

const trackDescription = (track) => (
  <List.Description>
    {track.artist.name} <small>({millisToMinutesAndSeconds(track.length)})</small>
  </List.Description>
)

const listItems = (tracks, images, currentTrack, onRemoveTrack) => {
  let time

  return tracks.map((track, index) => {
    const isCurrent = isCurrentTrack(currentTrack, track)
    if (time) time += track.length
    if (isCurrent) time = Date.now()

    return (
      <List.Item
        key={`${index}-${track.uri}`}
      >
        {imageChooser(track, images, isCurrent, onRemoveTrack)}
        <List.Content
          className={classnames({'track-info': !time})}
        >
          {trackStartTime(time, isCurrent)}
          {trackHeading(track)}
          {trackDescription(track)}
        </List.Content>
      </List.Item>
    )
  })
}

const Tracklist = ({ tracks, images, currentTrack, onRemoveTrack }) => {
  if (!tracks) { return null }

  return (
    <List relaxed>
      {listItems(tracks, images, currentTrack, onRemoveTrack)}
    </List>
  )
}

Tracklist.propTypes = {
  tracks: PropTypes.array,
  images: PropTypes.object,
  currentTrack: PropTypes.object,
  onRemoveTrack: PropTypes.func.isRequired
}

export default Tracklist

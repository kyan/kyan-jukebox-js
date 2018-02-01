import React from 'react'
import PropTypes from 'prop-types'
import { List, Image } from 'semantic-ui-react'
import dateformat from 'dateformat'
import { millisToMinutesAndSeconds } from '../../utils/time'
import './index.css'

const isCurrentTrack = (currentTrack, track) => {
  return currentTrack.uri === track.uri
}

const imageChooser = (track, images, isCurrent) => {
  let image
  if (track.album) image = images[track.album.uri]
  if (track.composer) image = images[track.composer.uri]
  if (!image) image = 'default-image.jpg'

  return (
    <Image
      bordered={isCurrent}
      src={image}
      size='mini'
      avatar
    />
  )
}

const trackStartTime = (time) => {
  return <List.Header as='h5'>{dateformat(new Date(time), 'h:MM')}</List.Header>
}

const listItems = (tracks, images, currentTrack) => {
  return tracks.map((track, index) => {
    return (
      <List.Item
        key={`${index}-${track.uri}`}
      >
        {imageChooser(track, images, isCurrentTrack(currentTrack, track))}
        <List.Content>
          {trackStartTime(track.start_time)}
          <List.Header as='h3'>{track.name}</List.Header>
          <List.Description>{track.artist.name} <small>({millisToMinutesAndSeconds(track.length)})</small></List.Description>
        </List.Content>
      </List.Item>
    )
  })
}

const Tracklist = ({ tracks, images, currentTrack }) => {
  if (!tracks) { return null }

  return (
    <List relaxed>
      {listItems(tracks, images, currentTrack)}
    </List>
  )
}

Tracklist.propTypes = {
  tracks: PropTypes.array,
  images: PropTypes.object,
  currentTrack: PropTypes.object
}

export default Tracklist

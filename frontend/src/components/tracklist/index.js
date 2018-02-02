import React from 'react'
import PropTypes from 'prop-types'
import { List, Image } from 'semantic-ui-react'
import dateformat from 'dateformat'
import { millisToMinutesAndSeconds } from '../../utils/time'
import defaultImage from './../current-track/default-artwork.png'
import './index.css'

const isCurrentTrack = (currentTrack, track) => {
  return currentTrack.uri === track.uri
}

const imageChooser = (track, images, isCurrent) => {
  let image
  if (track.album) image = images[track.album.uri]
  if (track.composer) image = images[track.composer.uri]
  if (!image) image = defaultImage

  return (
    <Image
      bordered={isCurrent}
      src={image}
      size='mini'
      avatar
    />
  )
}

const trackStartTime = (time, isCurrent) => {
  if (!time || isCurrent) return null
  return <List.Header as='h5'>{dateformat(new Date(time), 'h:MM')}</List.Header>
}

const listItems = (tracks, images, currentTrack) => {
  let time

  return tracks.map((track, index) => {
    const isCurrent = isCurrentTrack(currentTrack, track)
    if (time) time += track.length
    if (isCurrent) time = Date.now()

    return (
      <List.Item
        key={`${index}-${track.uri}`}
      >
        {imageChooser(track, images, isCurrent)}
        <List.Content>
          {trackStartTime(time, isCurrent)}
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

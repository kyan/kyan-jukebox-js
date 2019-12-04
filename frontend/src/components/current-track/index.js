import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon, Image } from 'semantic-ui-react'
import { Line } from 'rc-progress'
import defaultImage from './default-artwork.png'
import { millisToMinutesAndSeconds } from 'utils/time'
import './index.css'

const albumDescription = album => {
  if (!album) return null
  const year = album.year ? ` (${album.year})` : null
  return <Card.Description>{album.name}{year}</Card.Description>
}

const composerDescription = composer => {
  if (!composer) return null
  return <Card.Description>{composer.name}</Card.Description>
}

const albumArt = (image) => {
  if (!image) image = defaultImage
  return <Image src={image} />
}

const serviceIcon = (uri) => {
  const lookup = {
    spotify: 'green'
  }
  const key = uri.split(':')[0]
  if (!lookup[key]) return null
  return <Icon name={key} color={lookup[key]} />
}

const noTrack = () => (
  <Card>
    { albumArt(null) }
    <Card.Content>
      <Card.Header>Nothing playing</Card.Header>
      <Card.Description>Drag some music here or press play.</Card.Description>
    </Card.Content>
  </Card>
)

const CurrentTrack = ({ track, image, progress, remaining }) => {
  if (!track) { return noTrack() }

  return (
    <Card>
      { albumArt(image) }
      <Card.Content>
        <div className='progress-container'>
          <span className='remaining-text'>{millisToMinutesAndSeconds(remaining)}</span>
          <span className='track-length'>{millisToMinutesAndSeconds(track.length)}</span>
          <Line percent={progress} />
        </div>
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>{track.artist.name}</Card.Meta>
        { albumDescription(track.album) }
        { composerDescription(track.composer) }
      </Card.Content>
      <Card.Content extra>
        {serviceIcon(track.uri)}
      </Card.Content>
    </Card>
  )
}

CurrentTrack.propTypes = {
  track: PropTypes.object,
  image: PropTypes.string,
  progress: PropTypes.number,
  remaining: PropTypes.number
}

export default CurrentTrack

import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Progress } from 'semantic-ui-react'
import defaultImage from './default-artwork.png'
import { millisToMinutesAndSeconds } from '../../utils/time'

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

const CurrentTrack = ({ track, image, progress }) => {
  if (!track) { return null }

  return (
    <Card>
      { albumArt(image) }
      <Card.Content>
        <Progress percent={progress} size='tiny' />
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>({millisToMinutesAndSeconds(track.length)}) {track.artist.name}</Card.Meta>
        { albumDescription(track.album) }
        { composerDescription(track.composer) }
      </Card.Content>
    </Card>
  )
}

CurrentTrack.propTypes = {
  track: PropTypes.object,
  image: PropTypes.string,
  progress: PropTypes.number
}

export default CurrentTrack

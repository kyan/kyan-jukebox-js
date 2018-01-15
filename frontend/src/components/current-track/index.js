import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Progress } from 'semantic-ui-react'
import { millisToMinutesAndSeconds } from '../../utils/time'

const albumDate = album => {
  return album.date ? `(${album.date})` : null
}

const CurrentTrack = ({ track, image, progress }) => {
  if (!track) { return null }

  return (
    <Card>
      <Image src={image} />
      <Card.Content>
        <Progress percent={progress} size='tiny' />
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>({millisToMinutesAndSeconds(track.length)}) {track.artist.name}</Card.Meta>
        <Card.Description>{track.album.name} {albumDate(track.album)}</Card.Description>
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

import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image } from 'semantic-ui-react';
import { millisToMinutesAndSeconds } from '../../utils/track';

const albumDate = album => {
  return album.date ? `(${album.date})` : null
}
const CurrentTrack = ({ track, image }) => {
  if (!track) { return null; }

  return (
    <Card>
      <Image src={image} />
      <Card.Content>
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>({millisToMinutesAndSeconds(track.length)}) {track.artist.name}</Card.Meta>
        <Card.Description>{track.album.name} {albumDate(track.album)}</Card.Description>
      </Card.Content>
    </Card>
  )
}

CurrentTrack.propTypes = {
  track: PropTypes.object,
  image: PropTypes.string
}

export default CurrentTrack;

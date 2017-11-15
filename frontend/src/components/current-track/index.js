import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image } from 'semantic-ui-react';

const albumDate = album => {
  return album.date ? `(${album.date})` : null
}
const CurrentTrack = ({ track, image }) => {
  if (!track) { return null; }
  const uri = image ? image.uri : null;

  return (
    <Card>
      <Image src={uri} />
      <Card.Content>
        <Card.Header>{track.name}</Card.Header>
        <Card.Meta>
          <span className='date'>{track.artist.name}</span>
        </Card.Meta>
        <Card.Description>{track.album.name} {albumDate(track.album)}</Card.Description>
      </Card.Content>
    </Card>
  )
}

CurrentTrack.propTypes = {
  track: PropTypes.object,
  image: PropTypes.object
}

export default CurrentTrack;

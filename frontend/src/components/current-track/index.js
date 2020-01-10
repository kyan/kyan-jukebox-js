import React from 'react'
import PropTypes from 'prop-types'
import { Card, Image } from 'semantic-ui-react'
import { Line } from 'rc-progress'
import AddedBy from 'components/added-by'
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

const noTrack = () => (
  <Card>
    <Image src={defaultImage} />
    <Card.Content>
      <Card.Header>Nothing playing</Card.Header>
      <Card.Description>Drag some music here or press play.</Card.Description>
    </Card.Content>
  </Card>
)

const CurrentTrack = ({ track, progress, remaining }) => {
  if (!track) { return noTrack() }

  return (
    <Card>
      <Image src={track.image || defaultImage} />
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
        <AddedBy users={track.addedBy} />
      </Card.Content>
    </Card>
  )
}

CurrentTrack.propTypes = {
  track: PropTypes.object,
  progress: PropTypes.number,
  remaining: PropTypes.number
}

export default CurrentTrack

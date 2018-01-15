import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const VOLUME_INC = 1
const VOLUME_MAX = 100
const VOLUME_MIN = 0

const volumeUp = (volume, cb) => {
  volume += VOLUME_INC
  if (volume <= VOLUME_MAX) {
    return () => {
      cb(volume)
    }
  }
}

const volumeDown = (volume, cb) => {
  volume -= VOLUME_INC
  if (volume >= VOLUME_MIN) {
    return () => {
      cb(volume)
    }
  }
}

const VolumeButtons = ({ volume, onVolumeChange }) => (
  <Button.Group floated='right'>
    <Button className='jb-volume-down' onClick={volumeDown(volume, onVolumeChange)}>
      <Icon name='volume down' />
    </Button>
    <Button.Or text={volume} />
    <Button className='jb-volume-up' onClick={volumeUp(volume, onVolumeChange)}>
      <Icon name='volume up' />
    </Button>
  </Button.Group>
)

VolumeButtons.propTypes = {
  volume: PropTypes.number,
  onVolumeChange: PropTypes.func.isRequired
}

export default VolumeButtons

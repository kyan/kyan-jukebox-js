import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'
import './index.css'

const VOLUME_INC = 5
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

const VolumeDownButton = props => (
  <Button
    className='jb-volume-down'
    onClick={volumeDown(props.volume, props.onChange)}
    disabled={props.disabled}
    size='huge'
  >
    <Icon name='volume down' />
  </Button>
)

const VolumeUpButton = props => (
  <Button
    className='jb-volume-up'
    onClick={volumeUp(props.volume, props.onChange)}
    disabled={props.disabled}
    size='huge'
  >
    <Icon name='volume up' />
  </Button>
)

const VolumeButtons = ({ disabled, onVolumeChange }) => {
  const jukebox = useSelector(state => state.jukebox)

  return (
    <Button.Group floated='right'>
      <VolumeDownButton volume={jukebox.volume} onChange={onVolumeChange} disabled={disabled} />
      <span className='labelWrapper'>
        <Button.Or text={jukebox.volume} />
      </span>
      <VolumeUpButton volume={jukebox.volume} onChange={onVolumeChange} disabled={disabled} />
    </Button.Group>
  )
}

VolumeButtons.propTypes = {
  disabled: PropTypes.bool,
  onVolumeChange: PropTypes.func.isRequired
}

export default VolumeButtons

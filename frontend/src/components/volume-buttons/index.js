import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Icon } from 'semantic-ui-react'
import './styles.scss'

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

const VolumeDownButton = (props) => (
  <button
    onClick={volumeDown(props.volume, props.onChange)}
    disabled={props.disabled}
    className={classnames('c-button', {
      'c-button--disabled': props.disabled
    })}
  >
    <Icon name='volume down' />
  </button>
)

const VolumeUpButton = (props) => (
  <button
    onClick={volumeUp(props.volume, props.onChange)}
    disabled={props.disabled}
    className={classnames('c-button', {
      'c-button--disabled': props.disabled
    })}
  >
    <Icon name='volume up' />
  </button>
)

const VolumeButtons = ({ disabled, onVolumeChange }) => {
  const jukebox = useSelector(state => state.jukebox)

  return (
    <div className='c-volumeControls'>
      <VolumeDownButton
        volume={jukebox.volume}
        onChange={onVolumeChange}
        disabled={disabled}
      />
      <VolumeUpButton
        volume={jukebox.volume}
        onChange={onVolumeChange}
        disabled={disabled}
      />
      <div className='c-volumeControls__indicator'>{jukebox.volume}</div>
    </div>
  )
}

VolumeButtons.propTypes = {
  disabled: PropTypes.bool,
  onVolumeChange: PropTypes.func.isRequired
}

export default VolumeButtons

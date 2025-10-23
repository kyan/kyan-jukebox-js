import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import './index.css'

const VOLUME_INC = 5
const VOLUME_MAX = 100
const VOLUME_MIN = 0

interface JukeboxState {
  volume: number
}

interface RootState {
  jukebox: JukeboxState
}

interface VolumeButtonsProps {
  disabled?: boolean
  onVolumeChange: (volume: number) => void
}

interface VolumeButtonProps {
  volume: number
  onChange: (volume: number) => void
  disabled?: boolean
}

const volumeUp = (volume: number, cb: (volume: number) => void) => {
  const newVolume = volume + VOLUME_INC
  if (newVolume <= VOLUME_MAX) {
    return () => {
      cb(newVolume)
    }
  }
  return undefined
}

const volumeDown = (volume: number, cb: (volume: number) => void) => {
  const newVolume = volume - VOLUME_INC
  if (newVolume >= VOLUME_MIN) {
    return () => {
      cb(newVolume)
    }
  }
  return undefined
}

const VolumeDownButton: React.FC<VolumeButtonProps> = ({ volume, onChange, disabled }) => (
  <Button className='jb-volume-down' onClick={volumeDown(volume, onChange)} disabled={disabled}>
    <Icon name='volume down' />
  </Button>
)

const VolumeUpButton: React.FC<VolumeButtonProps> = ({ volume, onChange, disabled }) => (
  <Button className='jb-volume-up' onClick={volumeUp(volume, onChange)} disabled={disabled}>
    <Icon name='volume up' />
  </Button>
)

const VolumeButtons: React.FC<VolumeButtonsProps> = ({ disabled, onVolumeChange }) => {
  const jukebox = useSelector((state: RootState) => state.jukebox)

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

export default VolumeButtons

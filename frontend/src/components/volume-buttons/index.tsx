import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from '@/components/ui/icon'

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
  <button
    className='volume-button volume-button--down'
    onClick={volumeDown(volume, onChange)}
    disabled={disabled || volume <= VOLUME_MIN}
    title='Decrease volume'
  >
    <Icon name='volume down' className='volume-icon' />
  </button>
)

const VolumeUpButton: React.FC<VolumeButtonProps> = ({ volume, onChange, disabled }) => (
  <button
    className='volume-button volume-button--up'
    onClick={volumeUp(volume, onChange)}
    disabled={disabled || volume >= VOLUME_MAX}
    title='Increase volume'
  >
    <Icon name='volume up' className='volume-icon' />
  </button>
)

const VolumeButtons: React.FC<VolumeButtonsProps> = ({ disabled, onVolumeChange }) => {
  const jukebox = useSelector((state: RootState) => state.jukebox)

  return (
    <div className='volume-wrapper'>
      <VolumeDownButton volume={jukebox.volume} onChange={onVolumeChange} disabled={disabled} />
      <div className='volume-display'>{jukebox.volume}</div>
      <VolumeUpButton volume={jukebox.volume} onChange={onVolumeChange} disabled={disabled} />
    </div>
  )
}

export default VolumeButtons

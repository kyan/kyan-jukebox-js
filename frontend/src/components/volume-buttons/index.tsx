import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { VolumeX, Volume2 } from 'lucide-react'

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
  <Button
    variant='outline'
    size='icon'
    onClick={volumeDown(volume, onChange)}
    disabled={disabled || volume <= VOLUME_MIN}
    className='volume-button--down'
  >
    <VolumeX className='volume-icon' />
  </Button>
)

const VolumeUpButton: React.FC<VolumeButtonProps> = ({ volume, onChange, disabled }) => (
  <Button
    variant='outline'
    size='icon'
    onClick={volumeUp(volume, onChange)}
    disabled={disabled || volume >= VOLUME_MAX}
    className='volume-button--up'
  >
    <Volume2 className='volume-icon' />
  </Button>
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

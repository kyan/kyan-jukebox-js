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
    className='rounded-r-none border-r-0'
  >
    <VolumeX className='h-4 w-4' />
  </Button>
)

const VolumeUpButton: React.FC<VolumeButtonProps> = ({ volume, onChange, disabled }) => (
  <Button
    variant='outline'
    size='icon'
    onClick={volumeUp(volume, onChange)}
    disabled={disabled || volume >= VOLUME_MAX}
    className='rounded-l-none'
  >
    <Volume2 className='h-4 w-4' />
  </Button>
)

const VolumeButtons: React.FC<VolumeButtonsProps> = ({ disabled, onVolumeChange }) => {
  const jukebox = useSelector((state: RootState) => state.jukebox)

  return (
    <div className='flex items-center float-right'>
      <VolumeDownButton volume={jukebox.volume} onChange={onVolumeChange} disabled={disabled} />
      <div className='flex items-center justify-center border border-x-0 border-input bg-background px-3 h-10 text-sm font-medium min-w-[3rem]'>
        {jukebox.volume}
      </div>
      <VolumeUpButton volume={jukebox.volume} onChange={onVolumeChange} disabled={disabled} />
    </div>
  )
}

export default VolumeButtons

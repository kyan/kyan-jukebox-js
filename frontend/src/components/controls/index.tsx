import React from 'react'
import { useSelector } from 'react-redux'
import MopidyApi from 'constants/mopidy-api'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

import type { JukeboxAppState } from 'reducers'

interface SkipButtonProps {
  disabled: boolean
  onClick: () => void
  type: 'forward' | 'backward'
}

interface PlayButtonProps {
  disabled: boolean
  onPause: () => void
  onPlay: () => void
  state: string
}

interface ControlsProps {
  disabled: boolean
  onPlay: () => void
  onPause: () => void
  onPrevious: () => void
  onNext: () => void
}

const SkipButton = ({ disabled, onClick, type }: SkipButtonProps) => {
  const iconName = type === 'forward' ? 'step forward' : 'step backward'

  return (
    <button
      className={cn(
        'border-none bg-transparent p-0 transition-colors',
        'focus:outline-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={`SkipButton--${type}`}
    >
      <Icon
        name={iconName}
        size='large'
        className={cn(
          'transition-colors',
          disabled ? 'text-muted' : 'text-muted-foreground hover:text-foreground'
        )}
      />
    </button>
  )
}

const PlayButton = ({ disabled, onPause, onPlay, state }: PlayButtonProps) => {
  const icon = state === MopidyApi.PLAYING ? 'pause' : 'play'
  const clickHandler = state === MopidyApi.PLAYING ? onPause : onPlay

  return (
    <button
      className={cn(
        'border-none bg-transparent p-0 transition-colors',
        'focus:outline-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      )}
      onClick={clickHandler}
      disabled={disabled}
      data-testid='PlayButton'
    >
      <Icon
        name={icon}
        size='big'
        className={cn('transition-colors', disabled ? 'text-muted' : 'text-foreground')}
      />
    </button>
  )
}

const Controls = ({ disabled, onPlay, onPause, onPrevious, onNext }: ControlsProps) => {
  const jukebox = useSelector((state: JukeboxAppState) => state.jukebox)

  return (
    <div className='w-[150px] flex justify-between items-center'>
      <SkipButton onClick={onPrevious} disabled={disabled} type='backward' />
      <PlayButton
        onPlay={onPlay}
        onPause={onPause}
        state={jukebox.playbackState}
        disabled={disabled}
      />
      <SkipButton onClick={onNext} disabled={disabled} type='forward' />
    </div>
  )
}

export default Controls

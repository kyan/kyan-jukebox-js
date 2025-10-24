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
        'h-[45px] w-[45px] rounded-full transition-all duration-200 flex items-center justify-center',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-accent hover:scale-110 active:scale-95 hover:shadow-lg'
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={`SkipButton--${type}`}
    >
      <Icon
        name={iconName}
        size='large'
        className={cn('transition-colors', disabled ? 'text-muted' : 'text-foreground')}
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
        'h-[40px] w-[40px] rounded-full transition-all duration-200 flex items-center justify-center',
        'bg-primary text-primary-foreground shadow-lg',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-primary/90 hover:scale-110 hover:shadow-xl active:scale-95'
      )}
      onClick={clickHandler}
      disabled={disabled}
      data-testid='PlayButton'
    >
      <Icon name={icon} size='large' className='transition-colors' />
    </button>
  )
}

const Controls = ({ disabled, onPlay, onPause, onPrevious, onNext }: ControlsProps) => {
  const jukebox = useSelector((state: JukeboxAppState) => state.jukebox)

  return (
    <div className='flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-2 border border-border/50 shadow-sm h-[45px]'>
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

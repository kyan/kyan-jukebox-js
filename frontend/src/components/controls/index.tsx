import React from 'react'
import { useSelector } from 'react-redux'
import MopidyApi from '@/constants/mopidy-api'
import { Icon } from '@/components/ui/icon'

import type { JukeboxAppState } from '@/reducers'

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
      className='controls-button controls-button--skip'
      onClick={onClick}
      disabled={disabled}
      data-testid={`SkipButton--${type}`}
      title={type === 'forward' ? 'Next track' : 'Previous track'}
    >
      <Icon name={iconName} size='large' className='controls-icon' />
    </button>
  )
}

const PlayButton = ({ disabled, onPause, onPlay, state }: PlayButtonProps) => {
  const icon = state === MopidyApi.PLAYING ? 'pause' : 'play'
  const clickHandler = state === MopidyApi.PLAYING ? onPause : onPlay
  const isPlaying = state === MopidyApi.PLAYING

  return (
    <button
      className='controls-button controls-button--play'
      onClick={clickHandler}
      disabled={disabled}
      data-testid='PlayButton'
      title={isPlaying ? 'Pause' : 'Play'}
    >
      <Icon name={icon} size='large' className='controls-icon controls-icon--play' />
    </button>
  )
}

const Controls = ({ disabled, onPlay, onPause, onPrevious, onNext }: ControlsProps) => {
  const jukebox = useSelector((state: JukeboxAppState) => state.jukebox)

  return (
    <div className='controls-wrapper'>
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

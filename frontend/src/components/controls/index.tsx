import React from 'react'
import { useSelector } from 'react-redux'
import MopidyApi from 'constants/mopidy-api'
import { Icon } from 'semantic-ui-react'
import './index.css'

import type { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic'
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
  return (
    <button
      className='c-controls__button'
      onClick={onClick}
      disabled={disabled}
      data-testid={`SkipButton--${type}`}
    >
      <Icon name={`step ${type}` as SemanticICONS} size='big' />
    </button>
  )
}

const PlayButton = ({ disabled, onPause, onPlay, state }: PlayButtonProps) => {
  const icon = state === MopidyApi.PLAYING ? 'pause' : 'play'
  const clickHandler = state === MopidyApi.PLAYING ? onPause : onPlay

  return (
    <button
      className='c-controls__button'
      onClick={clickHandler}
      disabled={disabled}
      data-testid='PlayButton'
    >
      <Icon name={icon} size='big' />
    </button>
  )
}

const Controls = ({ disabled, onPlay, onPause, onPrevious, onNext }: ControlsProps) => {
  const jukebox = useSelector((state: JukeboxAppState) => state.jukebox)

  return (
    <div className='c-controls__wrapper'>
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

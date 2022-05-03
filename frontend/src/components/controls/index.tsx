import React from 'react'
import { useSelector } from 'react-redux'
import MopidyApi from 'constants/mopidy-api'
import { Icon } from 'semantic-ui-react'
import './index.css'

import type { JukeboxAppState } from 'reducers'

interface NavigateButtonProps {
  disabled: boolean
  onClick: () => void
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

const PreviousButton = ({ disabled, onClick }: NavigateButtonProps) => {
  return (
    <button
      className='c-controls__button'
      onClick={onClick}
      disabled={disabled}
      data-testid='PreviousButton'
    >
      <Icon name='step backward' size='big' />
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
const NextButton = ({ disabled, onClick }: NavigateButtonProps) => {
  return (
    <button
      className='c-controls__button'
      onClick={onClick}
      disabled={disabled}
      data-testid='NextButton'
    >
      <Icon name='step forward' size='big' />
    </button>
  )
}

const Controls = (props: ControlsProps) => {
  const jukebox = useSelector((state: JukeboxAppState) => state.jukebox)
  const { disabled, onPlay, onPause, onPrevious, onNext } = props

  return (
    <div className='c-controls__wrapper'>
      <PreviousButton onClick={onPrevious} disabled={disabled} />
      <PlayButton
        onPlay={onPlay}
        onPause={onPause}
        state={jukebox.playbackState}
        disabled={disabled}
      />
      <NextButton onClick={onNext} disabled={disabled} />
    </div>
  )
}

export default Controls

import React from 'react'
import { useSelector } from 'react-redux'
import MopidyApi from 'constants/mopidy-api'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import './index.css'

const PreviousButton = ({ disabled, onClick }) => {
  return (
    <button className='c-controls__button' onClick={onClick} disabled={disabled}>
      <Icon name='step backward' size='big' />
    </button>
  )
}
const PlayButton = ({ disabled, onPause, onPlay, state }) => {
  const icon = state === MopidyApi.PLAYING ? 'pause' : 'play'
  const clickHandler = state === MopidyApi.PLAYING ? onPause : onPlay

  return (
    <button className='c-controls__button' onClick={clickHandler} disabled={disabled}>
      <Icon name={icon} size='big' />
    </button>
  )
}
const NextButton = ({ disabled, onClick }) => {
  return (
    <button className='c-controls__button' onClick={onClick} disabled={disabled}>
      <Icon name='step forward' size='big' />
    </button>
  )
}

const Controls = props => {
  const jukebox = useSelector(state => state.jukebox)
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

Controls.propTypes = {
  disabled: PropTypes.bool,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default Controls

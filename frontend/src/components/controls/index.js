import React from 'react'
import { useSelector } from 'react-redux'
import classnames from 'classnames'
import SkipButtons from 'components/skip-buttons'
import MopidyApi from 'constants/mopidy-api'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import './styles.scss'

const PlayButton = (props) => (
  <button
    onClick={props.onClick}
    disabled={(props.state === MopidyApi.PLAYING || props.disabled)}
    className={classnames('c-button', {
      'c-button--disabled': (props.state === MopidyApi.PLAYING || props.disabled),
      'c-button--active': (props.state === MopidyApi.PLAYING)
    })}
  >
    <Icon name='play' />
  </button>
)

const PauseButton = (props) => (
  <button
    onClick={props.onClick}
    disabled={(props.state === MopidyApi.PAUSED || props.state === MopidyApi.STOPPED || props.disabled)}
    className={classnames('c-button', {
      'c-button--disabled': (props.state === MopidyApi.PAUSED || props.state === MopidyApi.STOPPED || props.disabled),
      'c-button--active': (props.state === MopidyApi.PAUSED)
    })}
  >
    <Icon name='pause' />
  </button>
)

const StopButton = (props) => (
  <button
    onClick={props.onClick}
    disabled={(props.state === MopidyApi.STOPPED || props.disabled)}
    className={classnames('c-button', {
      'c-button--disabled': (props.state === MopidyApi.STOPPED || props.disabled),
      'c-button--active': (props.state === MopidyApi.STOPPED)
    })}
  >
    <Icon name='stop' />
  </button>
)

const Controls = props => {
  const jukebox = useSelector(state => state.jukebox)
  const { disabled, onPlay, onPause, onStop, onPrevious, onNext } = props

  return (
    <span className='c-controls'>
      <SkipButtons
        disabled={disabled}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      <PlayButton
        onClick={onPlay}
        state={jukebox.playbackState}
        disabled={disabled}
      />
      <PauseButton
        onClick={onPause}
        state={jukebox.playbackState}
        disabled={disabled}
      />
      <StopButton
        onClick={onStop}
        state={jukebox.playbackState}
        disabled={disabled}
      />
    </span>
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

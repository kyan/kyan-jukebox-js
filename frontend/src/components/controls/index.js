import React from 'react'
import SkipButtons from 'components/skip-buttons'
import MopidyApi from 'constants/mopidy-api'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const playButton = (cb, playbackState, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(playbackState === MopidyApi.PLAYING || disabled)}
    active={(playbackState === MopidyApi.PLAYING)}
    className='jb-play-button'
  >
    <Button.Content hidden>Play</Button.Content>
    <Button.Content visible>
      <Icon name='play' />
    </Button.Content>
  </Button>
)

const pauseButton = (cb, playbackState, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(playbackState === MopidyApi.PAUSED || playbackState === MopidyApi.STOPPED || disabled)}
    active={(playbackState === MopidyApi.PAUSED)}
    className='jb-pause-button'
  >
    <Button.Content hidden>Pause</Button.Content>
    <Button.Content visible>
      <Icon name='pause' />
    </Button.Content>
  </Button>
)

const stopButton = (cb, playbackState, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(playbackState === MopidyApi.STOPPED || disabled)}
    active={(playbackState === MopidyApi.STOPPED)}
    className='jb-stop-button'
  >
    <Button.Content hidden>Stop</Button.Content>
    <Button.Content visible>
      <Icon name='stop' />
    </Button.Content>
  </Button>
)

const Controls = ({ disabled, playbackState, onPlay, onPause, onStop, onPrevious, onNext }) => {
  return (
    <span>
      <SkipButtons
        disabled={disabled}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      {playButton(onPlay, playbackState, disabled)}
      {pauseButton(onPause, playbackState, disabled)}
      {stopButton(onStop, playbackState, disabled)}
    </span>
  )
}

Controls.propTypes = {
  disabled: PropTypes.bool,
  playbackState: PropTypes.string,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default Controls

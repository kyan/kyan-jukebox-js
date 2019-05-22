import React from 'react'
import SkipButtons from '../../components/skip-buttons'
import MopidyApi from '../../constants/mopidy-api'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const radioButton = (cb, disabled, playbackState, radioPlaying, radioEnabled) => {
  if (!radioEnabled) { return null }

  return (
    <Button
      disabled={disabled || !radioPlaying}
      color={playbackState ? 'green' : null}
      onClick={cb}
      active={playbackState === true}
      className='jb-radio-button'
    >
      <Button.Content hidden>
        RADIO {playbackState ? <Icon loading name='certificate' /> : null}
      </Button.Content>
    </Button>
  )
}

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
    disabled={(playbackState === MopidyApi.PAUSED || disabled)}
    active={(playbackState === MopidyApi.PAUSED)}
    className='jb-pause-button'
  >
    <Button.Content hidden>Pause</Button.Content>
    <Button.Content visible>
      <Icon name='pause' />
    </Button.Content>
  </Button>
)

const Controls = ({ radioEnabled, radioPlaying, disabled, playbackState, onPlay, onPause, onPrevious, onNext, onStreaming }) => {
  return (
    <span>
      {radioButton(onStreaming, disabled, playbackState, radioPlaying, radioEnabled)}
      <SkipButtons
        disabled={disabled}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      {playButton(onPlay, playbackState, disabled)}
      {pauseButton(onPause, playbackState, disabled)}
    </span>
  )
}

Controls.propTypes = {
  radioEnabled: PropTypes.bool,
  radioPlaying: PropTypes.bool,
  disabled: PropTypes.bool,
  playbackState: PropTypes.string,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default Controls

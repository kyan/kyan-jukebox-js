import React from 'react'
import SkipButtons from '../../components/skip-buttons'
import MopidyApi from '../../constants/mopidy-api'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const radioButton = (cb, state, disabled) => (
  <Button
    disabled={disabled}
    color={state ? 'green' : null}
    onClick={cb}
    active={state}
    className='jb-radio-button'
  >
    <Button.Content hidden>
      RADIO {state ? <Icon loading name='certificate' /> : null}
    </Button.Content>
  </Button>
)

const playButton = (cb, state, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(state === MopidyApi.PLAYING || disabled)}
    active={(state === MopidyApi.PLAYING)}
    className='jb-play-button'
  >
    <Button.Content hidden>Play</Button.Content>
    <Button.Content visible>
      <Icon name='play' />
    </Button.Content>
  </Button>
)

const pauseButton = (cb, state, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(state === MopidyApi.PAUSED || disabled)}
    active={(state === MopidyApi.PAUSED)}
    className='jb-pause-button'
  >
    <Button.Content hidden>Pause</Button.Content>
    <Button.Content visible>
      <Icon name='pause' />
    </Button.Content>
  </Button>
)

const Controls = ({ disabled, state, onPlay, onPause, onPrevious, onNext, onStreaming }) => {
  return (
    <span>
      {radioButton(onStreaming, state.radioStreamPlaying, disabled)}
      <SkipButtons
        disabled={disabled}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      {playButton(onPlay, state.playbackState, disabled)}
      {pauseButton(onPause, state.playbackState, disabled)}
    </span>
  )
}

Controls.propTypes = {
  disabled: PropTypes.bool,
  state: PropTypes.object.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default Controls

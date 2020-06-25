import React from 'react'
import { useSelector } from 'react-redux'
import SkipButtons from 'components/skip-buttons'
import MopidyApi from 'constants/mopidy-api'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const PlayButton = (props) => (
  <Button
    onClick={props.onClick}
    animated='vertical'
    disabled={(props.state === MopidyApi.PLAYING || props.disabled)}
    active={(props.state === MopidyApi.PLAYING)}
    className='jb-play-button'
  >
    <Button.Content hidden>Play</Button.Content>
    <Button.Content visible>
      <Icon name='play' />
    </Button.Content>
  </Button>
)

const PauseButton = (props) => (
  <Button
    onClick={props.onClick}
    animated='vertical'
    disabled={(props.state === MopidyApi.PAUSED || props.state === MopidyApi.STOPPED || props.disabled)}
    active={(props.state === MopidyApi.PAUSED)}
    className='jb-pause-button'
  >
    <Button.Content hidden>Pause</Button.Content>
    <Button.Content visible>
      <Icon name='pause' />
    </Button.Content>
  </Button>
)

const StopButton = (props) => (
  <Button
    onClick={props.onClick}
    animated='vertical'
    disabled={(props.state === MopidyApi.STOPPED || props.disabled)}
    active={(props.state === MopidyApi.STOPPED)}
    className='jb-stop-button'
  >
    <Button.Content hidden>Stop</Button.Content>
    <Button.Content visible>
      <Icon name='stop' />
    </Button.Content>
  </Button>
)

const Controls = (props) => {
  const jukebox = useSelector(state => state.jukebox)
  const { disabled, onPlay, onPause, onStop, onPrevious, onNext } = props

  return (
    <span>
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

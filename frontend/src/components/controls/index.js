import React from 'react'
import SkipButtons from '../../components/skip-buttons'
import MopidyApi from '../../constants/mopidy-api'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const playButton = (cb, state) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(state === MopidyApi.PLAYING)}
  >
    <Button.Content hidden>Play</Button.Content>
    <Button.Content visible>
      <Icon name='play' />
    </Button.Content>
  </Button>
)

const pauseButton = (cb, state) => (
  <Button
    onClick={cb}
    animated='vertical'
    disabled={(state === MopidyApi.PAUSED)}
  >
    <Button.Content hidden>Pause</Button.Content>
    <Button.Content visible>
      <Icon name='pause' />
    </Button.Content>
  </Button>
)

const Controls = ({ state, onPlay, onPause, onPrevious, onNext }) => (
  <span>
    <SkipButtons
      onPrevious={onPrevious}
      onNext={onNext}
    />
    {playButton(onPlay, state)}
    {pauseButton(onPause, state)}
  </span>
)

Controls.propTypes = {
  state: PropTypes.string.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default Controls

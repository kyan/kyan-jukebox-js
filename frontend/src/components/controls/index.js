import React from 'react'
import SkipButtons from '../../components/skip-buttons'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const playButton = (cb) => (
  <Button
    onClick={cb}
    animated='vertical'
  >
    <Button.Content hidden>Play</Button.Content>
    <Button.Content visible>
      <Icon name='play' />
    </Button.Content>
  </Button>
)

const pauseButton = (cb) => (
  <Button
    onClick={cb}
    animated='vertical'
  >
    <Button.Content hidden>Pause</Button.Content>
    <Button.Content visible>
      <Icon name='pause' />
    </Button.Content>
  </Button>
)

const Controls = ({ onPlay, onPause, onPrevious, onNext }) => (
  <span>
    <SkipButtons
      onPrevious={onPrevious}
      onNext={onNext}
    />
    {playButton(onPlay)}
    {pauseButton(onPause)}
  </span>
)

Controls.propTypes = {
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default Controls

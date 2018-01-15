import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const previousButton = (cb) => (
  <Button
    onClick={cb}
    animated='vertical'
    className='jb-previous-button'
  >
    <Button.Content hidden>Prev</Button.Content>
    <Button.Content visible>
      <Icon name='step backward' />
    </Button.Content>
  </Button>
)

const nextButton = (cb) => (
  <Button
    onClick={cb}
    animated='vertical'
    className='jb-next-button'
  >
    <Button.Content hidden>Next</Button.Content>
    <Button.Content visible>
      <Icon name='step forward' />
    </Button.Content>
  </Button>
)

const SkipButtons = ({ onPreviousPlayingClick, onNextPlayingClick }) => (
  <span>
    {previousButton(onPreviousPlayingClick)}
    {nextButton(onNextPlayingClick)}
  </span>
)

SkipButtons.propTypes = {
  onPreviousPlayingClick: PropTypes.func.isRequired,
  onNextPlayingClick: PropTypes.func.isRequired
}

export default SkipButtons

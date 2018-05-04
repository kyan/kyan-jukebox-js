import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const previousButton = (cb, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    className='jb-previous-button'
    disabled={disabled}
  >
    <Button.Content hidden>Prev</Button.Content>
    <Button.Content visible>
      <Icon name='step backward' />
    </Button.Content>
  </Button>
)

const nextButton = (cb, disabled) => (
  <Button
    onClick={cb}
    animated='vertical'
    className='jb-next-button'
    disabled={disabled}
  >
    <Button.Content hidden>Next</Button.Content>
    <Button.Content visible>
      <Icon name='step forward' />
    </Button.Content>
  </Button>
)

const SkipButtons = ({ disabled, onPrevious, onNext }) => (
  <span>
    {previousButton(onPrevious, disabled)}
    {nextButton(onNext, disabled)}
  </span>
)

SkipButtons.propTypes = {
  disabled: PropTypes.bool,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default SkipButtons

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

const SkipButtons = ({ onPrevious, onNext }) => (
  <span>
    {previousButton(onPrevious)}
    {nextButton(onNext)}
  </span>
)

SkipButtons.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default SkipButtons

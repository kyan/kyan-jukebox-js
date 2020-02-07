import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const PreviousButton = (props) => (
  <Button
    onClick={props.onClick}
    animated='vertical'
    className='jb-previous-button'
    disabled={props.disabled}
  >
    <Button.Content hidden>Prev</Button.Content>
    <Button.Content visible>
      <Icon name='step backward' />
    </Button.Content>
  </Button>
)

const NextButton = (props) => (
  <Button
    onClick={props.onClick}
    animated='vertical'
    className='jb-next-button'
    disabled={props.disabled}
  >
    <Button.Content hidden>Next</Button.Content>
    <Button.Content visible>
      <Icon name='step forward' />
    </Button.Content>
  </Button>
)

const SkipButtons = ({ disabled, onPrevious, onNext }) => (
  <>
    <PreviousButton onClick={onPrevious} disabled={disabled} />
    <NextButton onClick={onNext} disabled={disabled} />
  </>
)

SkipButtons.propTypes = {
  disabled: PropTypes.bool,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

export default SkipButtons

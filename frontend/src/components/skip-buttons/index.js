import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Icon } from 'semantic-ui-react'

const PreviousButton = props => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    className={classnames('c-button', {
      'c-button--disabled': props.disabled
    })}
  >
    <Icon name='step backward' />
  </button>
)

const NextButton = props => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    className={classnames('c-button', {
      'c-button--disabled': props.disabled
    })}
  >
    <Icon name='step forward' />
  </button>
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

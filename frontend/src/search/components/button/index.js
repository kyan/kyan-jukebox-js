import React from 'react'
import { func, bool } from 'prop-types'
import { Icon } from 'semantic-ui-react'
import classnames from 'classnames'

const SearchButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classnames('c-button', {
      'c-button--disabled': disabled
    })}
  >
    <Icon name='search' />
  </button>
)

SearchButton.propTypes = {
  onClick: func.isRequired,
  disabled: bool.isRequired
}

export default SearchButton

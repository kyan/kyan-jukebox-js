import React from 'react'
import { func, bool } from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const SearchButton = ({ onClick, disabled }) => (
  <Button animated='vertical' floated='right' onClick={onClick} disabled={disabled}>
    <Button.Content hidden>Search</Button.Content>
    <Button.Content visible>
      <Icon name='search' />
    </Button.Content>
  </Button>
)

SearchButton.propTypes = {
  onClick: func.isRequired,
  disabled: bool.isRequired
}

export default SearchButton

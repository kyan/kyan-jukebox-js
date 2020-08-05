import React from 'react'
import { Button, Icon } from 'semantic-ui-react'

type SearchButtonProps = {
  disabled: boolean
  onClick: () => void
}

const SearchButton: React.FC<SearchButtonProps> = props => (
  <Button animated='vertical' floated='right' onClick={props.onClick} disabled={props.disabled}>
    <Button.Content hidden>Search</Button.Content>
    <Button.Content visible>
      <Icon name='search' />
    </Button.Content>
  </Button>
)

export default SearchButton

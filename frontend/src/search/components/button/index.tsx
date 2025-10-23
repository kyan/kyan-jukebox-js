import React from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

type SearchButtonProps = {
  disabled: boolean
  onClick: () => void
}

const SearchButton: React.FC<SearchButtonProps> = props => (
  <Button
    variant='default'
    size='default'
    onClick={props.onClick}
    disabled={props.disabled}
    className='float-right group'
  >
    <Search className='h-4 w-4 mr-2' />
    <span className='hidden group-hover:inline'>Search</span>
  </Button>
)

export default SearchButton

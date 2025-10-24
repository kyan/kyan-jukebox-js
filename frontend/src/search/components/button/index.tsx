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
    size='lg'
    onClick={props.onClick}
    disabled={props.disabled}
    className='h-[45px] group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/90'
  >
    <Search className='h-5 w-5 mr-2 transition-transform group-hover:rotate-12' />
    <span className='font-semibold'>Search Music</span>
  </Button>
)

export default SearchButton

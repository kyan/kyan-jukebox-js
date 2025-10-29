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
    className='h-[40px] sm:h-[45px] group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/90 px-3 sm:px-4'
  >
    <Search className='h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 transition-transform group-hover:rotate-12' />
    <span className='font-semibold text-sm sm:text-base'>Search Music</span>
  </Button>
)

export default SearchButton

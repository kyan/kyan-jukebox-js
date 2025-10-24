import React from 'react'
import { Sheet, SheetContent, SheetPortal, SheetOverlay } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import SearchItem from '../search-item'
import DraggableSearchItem from '../draggable-search-item'
import { cn } from '@/lib/utils'
import './index.css'

type SearchItemsProps = {
  tracks: ReadonlyArray<any>
  onClick: (uri: string) => void
  onAdd: (track: any) => void
}

type MixItemsProps = {
  tracks: ReadonlyArray<any>
  onSwap: (a: number, b: number) => void
  onRemove: (uri: string) => void
}

type YourMixProps = {
  tracks: ReadonlyArray<any>
  onRemoveFromMix: (uri: string) => void
  onSwapTracks: (a: number, b: number) => void
  onAddTracks: (uris: string[]) => void
}

type SearchProps = {
  visible: boolean
  onClose: () => void
  results: ReadonlyArray<any>
  curatedList: ReadonlyArray<any>
  onSubmit: () => void
  query: string
  onSwapTracks: (a: number, b: number) => void
  onRemoveFromMix: (uri: string) => void
  onQueryChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
  onAddTrack: (uri: string) => void
  onAddTracks: (uris: string[]) => void
  onAddTrackToMix: (track: any) => void
  totalPages: number
  onPageChange: (_: any, data: any) => void
  children?: React.ReactNode
}

const SearchItems: React.FC<SearchItemsProps> = props => (
  <>
    {(props.tracks || []).map(track => (
      <SearchItem
        key={track.uri}
        track={track}
        onClick={() => props.onClick(track.uri)}
        onAdd={() => props.onAdd(track)}
      />
    ))}
  </>
)

const MixItems: React.FC<MixItemsProps> = props => (
  <>
    {(props.tracks || []).map((track, i) => (
      <DraggableSearchItem
        i={i}
        key={i}
        track={track}
        onRemove={() => props.onRemove(track.uri)}
        action={props.onSwap}
      />
    ))}
  </>
)

const YourMix: React.FC<YourMixProps> = props => {
  if (!props.tracks || props.tracks.length === 0) return null
  const uris = props.tracks.map(track => track.uri)

  return (
    <>
      <div className='flex items-center justify-center mb-4'>
        <Separator className='flex-1' />
        <h4 className='px-4 text-sm font-semibold text-white uppercase tracking-wide'>Your Mix</h4>
        <Separator className='flex-1' />
      </div>
      <div className='space-y-2 mb-4'>
        <MixItems
          tracks={props.tracks}
          onRemove={props.onRemoveFromMix}
          onSwap={props.onSwapTracks}
        />
      </div>
      <Button
        onClick={() => props.onAddTracks(uris)}
        className='w-full mb-4 search-list-item__add_to_mix'
        variant='secondary'
      >
        Add mix to playlist
      </Button>
      <Separator className='my-4' />
    </>
  )
}

const Search: React.FC<SearchProps> = props => {
  const {
    visible,
    onClose,
    results,
    curatedList,
    onSubmit,
    query,
    onSwapTracks,
    onRemoveFromMix,
    onQueryChange,
    onAddTrack,
    onAddTracks,
    onAddTrackToMix,
    totalPages,
    onPageChange
  } = props
  const inputEl = React.useRef<HTMLInputElement>(null)
  const [activePage, setActivePage] = React.useState(1)

  const handlePageChange = (page: number) => {
    setActivePage(page)
    onPageChange(null, { activePage: page })
  }

  React.useEffect(() => {
    if (visible && inputEl.current) {
      setTimeout(() => {
        inputEl.current?.focus()
      }, 100)
    }
  }, [visible])

  return (
    <>
      <Sheet open={visible} onOpenChange={open => !open && onClose()}>
        <SheetPortal>
          <SheetOverlay onClick={onClose} />
          <SheetContent
            side='right'
            className='w-full sm:max-w-2xl overflow-y-auto sidebar-search bg-[rgb(71,71,71)] text-white border-l-0'
            onOpenAutoFocus={e => {
              e.preventDefault()
              inputEl.current?.focus()
            }}
          >
            <YourMix
              tracks={curatedList}
              onSwapTracks={onSwapTracks}
              onAddTracks={onAddTracks}
              onRemoveFromMix={onRemoveFromMix}
            />

            <form
              onSubmit={e => {
                e.preventDefault()
                onSubmit()
              }}
              className='space-y-4 mb-6'
            >
              <div className='space-y-2'>
                <Label
                  htmlFor='search-input'
                  className='text-white uppercase text-xs font-semibold'
                >
                  Search
                </Label>
                <Input
                  ref={inputEl}
                  id='search-input'
                  aria-label='search-input'
                  placeholder='track, artist or album'
                  onChange={onQueryChange}
                  value={query}
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/50'
                />
              </div>
              <Button type='submit' className='w-full' variant='secondary'>
                Find
              </Button>
            </form>

            <div className='flex items-center justify-center mb-4'>
              <Separator className='flex-1' />
              <h4 className='px-4 text-sm font-semibold text-white uppercase tracking-wide'>
                Results
              </h4>
              <Separator className='flex-1' />
            </div>

            {totalPages > 1 && (
              <Pagination className='mb-4'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                      className={cn(
                        'text-white hover:bg-white/10 cursor-pointer',
                        activePage === 1 && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber: number
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (activePage <= 3) {
                      pageNumber = i + 1
                    } else if (activePage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = activePage - 2 + i
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={activePage === pageNumber}
                          className={cn(
                            'text-white hover:bg-white/10 cursor-pointer',
                            activePage === pageNumber &&
                              'bg-white/20 font-bold border-b-2 border-[tomato]'
                          )}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                      className={cn(
                        'text-white hover:bg-white/10 cursor-pointer',
                        activePage === totalPages && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            <div className='space-y-4'>
              <SearchItems tracks={results} onClick={onAddTrack} onAdd={onAddTrackToMix} />
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
      <div
        className={cn('transition-opacity duration-300', visible && 'pointer-events-auto')}
        onClick={visible ? onClose : undefined}
      >
        {props.children}
      </div>
    </>
  )
}

export default Search

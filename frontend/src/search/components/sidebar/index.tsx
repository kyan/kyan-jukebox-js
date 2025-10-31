import React from 'react'
import { Sheet, SheetContent, SheetPortal, SheetOverlay } from '@/components/ui/sheet'
import SearchItem from '../search-item'
import DraggableSearchItem from '../draggable-search-item'

type SearchItemsProps = {
  tracks: ReadonlyArray<any>
  onClick: (uri: string) => void
  onAdd?: (track: any) => void
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
        onAdd={props.onAdd ? () => props.onAdd!(track) : undefined}
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
    <div className='your-mix-container'>
      <div className='search-section-header'>
        <div className='search-section-separator' />
        <h4>Your Mix</h4>
        <div className='search-section-separator' />
      </div>
      <div className='your-mix-items'>
        <MixItems
          tracks={props.tracks}
          onRemove={props.onRemoveFromMix}
          onSwap={props.onSwapTracks}
        />
      </div>
      <button onClick={() => props.onAddTracks(uris)} className='search-list-item__add_to_mix'>
        Add mix to playlist
      </button>
      <div className='search-section-separator' style={{ marginTop: '24px' }} />
    </div>
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
            className='sidebar-search'
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
              className='search-form'
            >
              <div className='search-form-group'>
                <label htmlFor='search-input' className='search-form-label'>
                  Search
                </label>
                <input
                  ref={inputEl}
                  id='search-input'
                  aria-label='search-input'
                  placeholder='track, artist or album'
                  onChange={onQueryChange}
                  value={query}
                  className='search-form-input'
                />
              </div>
              <button type='submit' className='search-form-button'>
                Find
              </button>
            </form>

            <div className='search-section-header'>
              <div className='search-section-separator' />
              <h4>Results</h4>
              <div className='search-section-separator' />
            </div>

            {totalPages > 1 && (
              <div className='search-list-pagination'>
                <button
                  onClick={() => handlePageChange(Math.max(1, activePage - 1))}
                  className={`search-list-pagination__item${activePage === 1 ? ' disabled' : ''}`}
                  disabled={activePage === 1}
                >
                  ‹
                </button>
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
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`search-list-pagination__item${activePage === pageNumber ? ' active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, activePage + 1))}
                  className={`search-list-pagination__item${activePage === totalPages ? ' disabled' : ''}`}
                  disabled={activePage === totalPages}
                >
                  ›
                </button>
              </div>
            )}

            <div className='search-results-container'>
              <SearchItems
                tracks={results}
                onClick={onAddTrack}
                onAdd={curatedList.length < 5 ? onAddTrackToMix : undefined}
              />
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
      {props.children}
    </>
  )
}

export default Search

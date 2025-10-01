import React from 'react'
import { Sidebar, Button, Form, List, Header, Divider, Pagination } from 'semantic-ui-react'
import SearchItem from '../search-item'
import DraggableSearchItem from '../draggable-search-item'
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
    {props.tracks.map(track => (
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
    {props.tracks.map((track, i) => (
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
  if (props.tracks.length === 0) return null
  const uris = props.tracks.map(track => track.uri)

  return (
    <>
      <Divider horizontal>
        <Header as='h4' inverted>
          Your Mix
        </Header>
      </Divider>
      <List divided inverted size='tiny'>
        <MixItems
          tracks={props.tracks}
          onRemove={props.onRemoveFromMix}
          onSwap={props.onSwapTracks}
        />
      </List>
      <Button
        fluid
        onClick={() => props.onAddTracks(uris)}
        className='search-list-item__add_to_mix'
      >
        Add mix to playlist
      </Button>
      <Divider horizontal />
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

  return (
    <Sidebar.Pushable>
      <Sidebar
        animation='overlay'
        icon='labeled'
        inverted='true'
        vertical='true'
        visible={visible}
        width='very wide'
        direction='right'
        className='sidebar-search'
        onShow={/* istanbul ignore next */ () => inputEl.current && inputEl.current.focus()}
      >
        <YourMix
          tracks={curatedList}
          onSwapTracks={onSwapTracks}
          onAddTracks={onAddTracks}
          onRemoveFromMix={onRemoveFromMix}
        />
        <Form inverted onSubmit={onSubmit}>
          <Form.Field>
            <label>SEARCH</label>
            <input
              ref={inputEl}
              aria-label='search-input'
              placeholder='track, artist or album'
              onChange={onQueryChange}
              value={query}
            />
          </Form.Field>
          <Button type='submit' fluid>
            Find
          </Button>
        </Form>
        <Divider horizontal>
          <Header as='h4' inverted>
            Results
          </Header>
        </Divider>
        {totalPages > 0 && (
          <Pagination
            className='search-list-pagination'
            defaultActivePage={1}
            firstItem={null}
            lastItem={null}
            pointing
            secondary
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
        <List divided relaxed inverted size='tiny'>
          <SearchItems tracks={results} onClick={onAddTrack} onAdd={onAddTrackToMix} />
        </List>
      </Sidebar>
      <Sidebar.Pusher dimmed={visible} onClick={visible ? onClose : null}>
        {props.children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  )
}

export default Search

import React, { useRef } from 'react'
import { string, func, bool, array, number } from 'prop-types'
import { Sidebar, Button, Form, List, Header, Divider, Pagination } from 'semantic-ui-react'
import SearchItem from '../search-item'
import DraggableSearchItem from '../draggable-search-item'
import './index.css'

const SearchItems = props =>
  props.tracks.map(item => (
    <SearchItem
      key={item.track.uri}
      track={item.track}
      onClick={() => props.onClick(item.track.uri)}
      onAdd={() => props.onAdd(item.track)}
    />
  ))

const MixItems = props =>
  props.tracks.map((item, i) => (
    <DraggableSearchItem
      i={i}
      key={i}
      track={item.track}
      onRemove={() => props.onRemove(item.track.uri)}
      action={props.onSwap}
    />
  ))

const YourMix = props => {
  if (props.tracks.length === 0) return null
  const uris = props.tracks.map(data => data.track.uri)

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

const Search = props => {
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
  const inputEl = useRef(null)

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
        onShow={() => inputEl.current.focus()}
      >
        <YourMix
          tracks={curatedList}
          onSwapTracks={onSwapTracks}
          onAddTracks={onAddTracks}
          onRemoveFromMix={onRemoveFromMix}
        />
        <Form inverted onSubmit={onSubmit}>
          <Form.Field>
            <label required>SEARCH</label>
            <input
              ref={inputEl}
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

Search.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  onQueryChange: func.isRequired,
  onAddTrack: func.isRequired,
  onAddTracks: func.isRequired,
  onAddTrackToMix: func.isRequired,
  onRemoveFromMix: func.isRequired,
  onPageChange: func.isRequired,
  visible: bool.isRequired,
  results: array.isRequired,
  onSwapTracks: func.isRequired,
  totalPages: number.isRequired,
  query: string
}

export default Search

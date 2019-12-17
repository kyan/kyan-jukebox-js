import React, { useRef } from 'react'
import { func, bool, array, number } from 'prop-types'
import { Sidebar, Button, Form, List, Header, Divider, Image, Pagination } from 'semantic-ui-react'
import './index.css'

const Search = (props) => {
  const {
    visible, onClose, results, onSubmit,
    onQueryChange, onAddTrack, totalPages, onPageChange
  } = props
  const inputEl = useRef(null)

  const addTrack = (uri) => () => {
    onAddTrack(uri)
  }

  const SearchItems = () => (
    results.map((item) => (
      <div className='search-list-item' key={item.track.uri} onClick={addTrack(item.track.uri)}>
        <Image
          floated='left'
          src={item.track.image}
          size='mini'
          title={`Click to add - ${item.track.name} - ${item.track.artist.name}`}
          className='search-list-item__image'
        />
        <List.Content>
          <div className='search-list-item__header'>{item.track.name} - {item.track.artist.name}</div>
          <div className='search-list-item__content'>{item.track.album.name}</div>
        </List.Content>
      </div>
    ))
  )

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
        <Form inverted onSubmit={onSubmit}>
          <Form.Field>
            <label required>SEARCH</label>
            <input
              ref={inputEl}
              placeholder='track, artist or album'
              onChange={onQueryChange}
            />
          </Form.Field>
          <Button type='submit' fluid>Submit</Button>
        </Form>
        <Divider horizontal>
          <Header as='h4' inverted>Results</Header>
        </Divider>
        {(totalPages > 0) &&
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
        }
        <List divided relaxed inverted size='tiny'>
          <SearchItems />
        </List>
      </Sidebar>
      <Sidebar.Pusher
        dimmed={visible}
        onClick={visible ? onClose : null}
      >
        { props.children }
      </Sidebar.Pusher>
    </Sidebar.Pushable >
  )
}

Search.propTypes = {
  onClose: func.isRequired,
  onSubmit: func.isRequired,
  onQueryChange: func.isRequired,
  onAddTrack: func.isRequired,
  onPageChange: func.isRequired,
  visible: bool.isRequired,
  results: array.isRequired,
  totalPages: number.isRequired
}

export default Search

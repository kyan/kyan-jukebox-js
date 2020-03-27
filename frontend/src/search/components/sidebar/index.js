import React, { useRef } from 'react'
import classnames from 'classnames'
import { string, func, bool, array, number } from 'prop-types'
import VotedBy from 'components/voted-by'
import { Sidebar, Button, Form, List, Header, Divider, Image, Pagination } from 'semantic-ui-react'
import './index.scss'

const VoteInfo = (props) => {
  if (!props.metrics) return null
  return <VotedBy size='mini' total={props.metrics.votesAverage} show={props.metrics.votes > 0} />
}

const SearchItem = (props) => (
  <div
    className={classnames('search-list-item', { 'disabled': props.track.explicit })}
    onClick={props.track.explicit ? undefined : props.onClick}
  >
    <Image
      floated='left'
      src={props.track.image}
      size='tiny'
      title={`Click to add - ${props.track.name} - ${props.track.artist.name}`}
      className='search-list-item__image'
      disabled={props.track.explicit}
    />
    <List.Content>
      <div className='search-list-item__header'>{props.track.name} - {props.track.artist.name}</div>
      <div className='search-list-item__content'>{props.track.album.name}</div>
      <VoteInfo metrics={props.track.metrics} />
    </List.Content>
  </div>
)

const SearchItems = (props) => (
  props.tracks.map(item => (
    <SearchItem
      key={item.track.uri}
      track={item.track}
      onClick={() => props.onAddTrack(item.track.uri)}
    />
  ))
)

const Search = (props) => {
  const {
    visible, onClose, results, onSubmit, query,
    onQueryChange, onAddTrack, totalPages, onPageChange
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
          <SearchItems tracks={results} onAddTrack={onAddTrack} />
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
  totalPages: number.isRequired,
  query: string
}

export default Search

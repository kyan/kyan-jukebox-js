import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Comment, Label, Item } from 'semantic-ui-react'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import RemoveTrack from 'components/remove-track'
import './index.css'

const TrackImage = (props) => (
  <Comment.Avatar
    className={props.isCurrent ? 'current-image' : null}
    src={props.src}
  />
)

const ImageChooser = (props) => {
  const image = props.image ? props.image : defaultImage

  return (
    <TrackImage
      src={image}
      isCurrent={props.isCurrent}
    />
  )
}

const TrackHeading = (props) => (
  <Comment.Author>{props.name}</Comment.Author>
)

const TrackDescription = (props) => (
  <Comment.Text>
    <Item as='a' className='track-search-link' onClick={props.onClick}>
      {props.artistName}
    </Item> <small>({millisToMinutesAndSeconds(props.trackLength)})</small>
  </Comment.Text>
)

const CurrentVote = (props) => {
  if (!props.metrics) return null
  const show = props.metrics.votes > 0
  if (!show) return null

  return (
    <Comment.Action as='span'>
      <VotedBy total={props.metrics.votesAverage} show={show} />
    </Comment.Action>
  )
}

const ActionRemove = (props) => {
  if (props.isCurrent || props.disabled) return null
  const removeTrack = (uri, cb) => () => cb(uri)

  return (
    <RemoveTrack
      uri={props.uri}
      name={props.name}
      onClick={removeTrack(props.uri, props.onClick)}
    />
  )
}

const CurrentPlays = (props) => {
  let basic = true
  let color = 'grey'
  if (!props.metrics) return null
  if (props.metrics.plays > 0) {
    basic = false
    color = null
  }

  return (
    <Comment.Action as='span'>
      <Label
        className='track-label'
        size='tiny'
        color={color}
        basic={basic}
      >Played <Label.Detail>{props.metrics.plays}</Label.Detail>
      </Label>
    </Comment.Action>
  )
}

const ListItems = (props) => {
  let beenPlayed = false
  const isCurrentTrack = (current, uri) => current && current.uri === uri

  return props.tracks.map((track, i) => {
    const { addedBy } = track
    const isCurrent = isCurrentTrack(props.current, track.uri)
    if (isCurrent) beenPlayed = beenPlayed || true

    return (
      <Comment
        className={classnames({ 'current-track': isCurrent })}
        key={`${i}${track.uri}`}
      >
        <ImageChooser
          image={track.image}
          isCurrent={isCurrent}
        />
        <Comment.Content
          className={classnames({ 'track-info': !beenPlayed })}
        >
          <TrackHeading
            name={track.name}
          />
          <TrackDescription
            artistName={track.artist.name}
            trackLength={track.length}
            onClick={props.onArtistSearch(track.artist.name)}
          />
          <Comment.Actions>
            <CurrentVote metrics={track.metrics} />
            <CurrentPlays metrics={track.metrics} />
            <Comment.Action>
              <AddedBy users={addedBy} />
            </Comment.Action>
            <ActionRemove
              uri={track.uri}
              name={track.name}
              disabled={props.disabled}
              isCurrent={isCurrent}
              onClick={props.onRemove}
            />
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    )
  })
}

const Tracklist = (props) => {
  if (!props.tracks) { return null }

  return (
    <Comment.Group size='small'>
      <ListItems
        disabled={props.disabled}
        tracks={props.tracks}
        current={props.currentTrack}
        onRemove={props.onRemoveTrack}
        onArtistSearch={props.onArtistSearch}
      />
    </Comment.Group>
  )
}

Tracklist.propTypes = {
  disabled: PropTypes.bool,
  tracks: PropTypes.array,
  currentTrack: PropTypes.object,
  onRemoveTrack: PropTypes.func.isRequired,
  onArtistSearch: PropTypes.func.isRequired
}

export default Tracklist

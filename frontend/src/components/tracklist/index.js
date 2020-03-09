import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Comment, Label, Item } from 'semantic-ui-react'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import RemoveTrack from 'components/remove-track'
import './styles.scss'

const TrackImage = (props) => (
  <Comment.Avatar
    src={props.src}
    className={classnames('c-tracklist__image', { 'c-tracklist__image--current': props.isCurrent })}
  />
)

const ImageChooser = props => {
  const image = props.image ? props.image : defaultImage

  return <TrackImage src={image} isCurrent={props.isCurrent} />
}

const TrackTitle = (props) => (
  <span className="c-tracklist__title">{props.name}</span>
)

const TrackInfo = (props) => (
  <React.Fragment>
    <span className="c-tracklist__artist">
      <Item as='a' className='track-search-link' onClick={props.onClick}>
        {props.artistName}
      </Item>
    </span>
    <span className="c-tracklist__trackLength">{millisToMinutesAndSeconds(props.trackLength)}</span>
  </React.Fragment>
)

const CurrentVote = props => {
  if (!props.metrics) return null
  const show = props.metrics.votes > 0
  if (!show) return null

  return (
    <Comment.Action as='span'>
      <VotedBy total={props.metrics.votesAverage} show={show} />
    </Comment.Action>
  )
}

const ActionRemove = props => {
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

const CurrentPlays = props => {
  let basic = true
  let color = 'grey'
  if (!props.metrics) return null
  if (props.metrics.plays > 0) {
    basic = false
    color = null
  }

  return (
    <Comment.Action as='span'>
      <Label className='track-label' size='tiny' color={color} basic={basic}>
        Played <Label.Detail>{props.metrics.plays}</Label.Detail>
      </Label>
    </Comment.Action>
  )
}

const ListItems = props => {
  let beenPlayed = false
  const isCurrentTrack = (current, uri) => current && current.uri === uri

  return props.tracks.map((track, i) => {
    const { addedBy } = track
    const isCurrent = isCurrentTrack(props.current, track.uri)
    if (isCurrent) beenPlayed = beenPlayed || true

    return (
      <div
        className={classnames('c-tracklist__item', { 'c-tracklist__item--current': isCurrent })}
        key={`${i}${track.uri}`}
      >
        <ImageChooser
          image={track.image}
          isCurrent={isCurrent}
        />
        <div
          className={classnames({ 'c-tracklist__info': !beenPlayed })}
        >
          <TrackTitle
            name={track.name}
          />
          <TrackInfo
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
        </div>
      </div>
    )
  })
}

const Tracklist = props => {
  if (!props.tracks) {
    return null
  }

  return (
    <div className="c-tracklist">
      <ListItems
        disabled={props.disabled}
        tracks={props.tracks}
        current={props.currentTrack}
        onRemove={props.onRemoveTrack}
        onArtistSearch={props.onArtistSearch}
      />
    </div>
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

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import RemoveTrack from 'components/remove-track'
import './index.scss'

const TrackImage = props => {
  const image = props.image ? props.image : defaultImage

  return (
    <figure className='trackImage__wrapper'>
      <img
        src={image}
        className={classnames('trackImage', { 'trackImage--current': props.isCurrent })}
        alt={props.alt}
      />
    </figure>
  )
}

const CurrentVote = props => {
  if (!props.metrics) return null
  const show = props.metrics.votes > 0
  if (!show) return null

  return <VotedBy total={props.metrics.votesAverage} show={show} size='large' />
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

const ListItems = props => {
  let beenPlayed = false
  const isCurrentTrack = (current, uri) => current && current.uri === uri

  return props.tracks.map((track, i) => {
    const { addedBy } = track
    const isCurrent = isCurrentTrack(props.current, track.uri)
    if (isCurrent) beenPlayed = beenPlayed || true

    return (
      <div
        className={classnames('trackRow', { 'trackRow--current': isCurrent })}
        key={`${i}${track.uri}`}
      >
        <div className='trackCell--image'>
          <TrackImage image={track.image} alt={track.name} isCurrent={isCurrent} />
        </div>
        <div className='trackCell--title'>
          <span className='trackCell__text'>{track.name}</span>
        </div>
        <div className='trackCell--artist'>
          <span className='trackCell__text'>{track.artist.name}</span>
        </div>
        <div>
          <p>{millisToMinutesAndSeconds(track.length)}</p>
        </div>
        <div>
          <p>Plays</p>
        </div>
        <div>
          <CurrentVote metrics={track.metrics} />
        </div>
        <div>
          <AddedBy users={addedBy} />
        </div>
        <div>
          <ActionRemove
            uri={track.uri}
            name={track.name}
            disabled={props.disabled}
            isCurrent={isCurrent}
            onClick={props.onRemove}
          />
        </div>
        {/* <Comment.Content className={classnames({ 'track-info': !beenPlayed })}>
          <TrackDescription
            artistName={track.artist.name}
            trackLength={track.length}
            onClick={props.onArtistSearch(track.artist.name)}
          />
          <Comment.Actions>
            <CurrentVote metrics={track.metrics} />
            <CurrentPlays metrics={track.metrics} />
            <Comment.Action>
            </Comment.Action>
          </Comment.Actions>
        </Comment.Content> */}
      </div>
    )
  })
}

const Tracklist = props => {
  if (!props.tracks) {
    return null
  }

  return (
    <ListItems
      disabled={props.disabled}
      tracks={props.tracks}
      current={props.currentTrack}
      onRemove={props.onRemoveTrack}
      onArtistSearch={props.onArtistSearch}
    />
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

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { List, Image, Label, Item } from 'semantic-ui-react'
import { millisToMinutesAndSeconds } from 'utils/time'
import defaultImage from 'components/current-track/default-artwork.png'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import './index.css'

const TrackImage = (props) => {
  let klass, title

  if (props.isCurrent) klass = 'current-image'
  if (props.onClick && !props.isCurrent) {
    title = 'Click to remove from playlist'
    klass = 'remove-image'
  }

  return (
    <Image
      bordered
      className={klass}
      size={props.hasBeenPlayed ? 'small' : 'tiny'}
      src={props.src}
      title={title}
      onClick={props.onClick}
      inline
    />
  )
}

const ImageChooser = (props) => {
  const removeTrack = (uri, cb) => () => cb(uri)
  const image = props.image ? props.image : defaultImage
  const onClick = (!props.disabled && !props.isCurrent) ? removeTrack(props.uri, props.onClick) : undefined

  return (
    <TrackImage
      src={image}
      isCurrent={props.isCurrent}
      onClick={onClick}
      hasBeenPlayed={props.hasBeenPlayed}
    />
  )
}

const TrackHeading = (props) => <List.Header as='h4'>{props.name}</List.Header>

const TrackDescription = (props) => (
  <List.Description>
    <Item as='a' className='track-search-link' onClick={props.onClick}>
      {props.artistName}
    </Item> <small>({millisToMinutesAndSeconds(props.trackLength)})</small>
  </List.Description>
)

const ListItems = (props) => {
  let beenPlayed = false
  const isCurrentTrack = (current, uri) => current && current.uri === uri

  return props.tracks.map((track, i) => {
    const { addedBy } = track
    const isCurrent = isCurrentTrack(props.current, track.uri)
    const averageVote = track.metrics.votesAverage
    const playCount = track.metrics.plays
    if (isCurrent) beenPlayed = beenPlayed || true

    return (
      <List.Item
        className={classnames({ 'current-track': isCurrent })}
        key={`${i}${track.uri}`}
      >
        <ImageChooser
          disable={props.disabled}
          uri={track.uri}
          image={track.image}
          isCurrent={isCurrent}
          onClick={props.onRemove}
          hasBeenPlayed={beenPlayed}
        />
        <List.Content
          className={classnames({ 'track-info': !beenPlayed })}
        >
          <TrackHeading name={track.name} />
          <TrackDescription
            artistName={track.artist.name}
            trackLength={track.length}
            onClick={props.onArtistSearch(track.artist.name)}
          />
          <VotedBy total={averageVote} />
          <Label className='track-label' size='tiny'>
            Played
            <Label.Detail>{playCount}</Label.Detail>
          </Label>
          <AddedBy users={addedBy} />
        </List.Content>
      </List.Item>
    )
  })
}

const Tracklist = (props) => {
  if (!props.tracks) { return null }

  return (
    <List relaxed='very' divided>
      <ListItems
        disabled={props.disabled}
        tracks={props.tracks}
        current={props.currentTrack}
        onRemove={props.onRemoveTrack}
        onArtistSearch={props.onArtistSearch}
      />
    </List>
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

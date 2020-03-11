import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import Slider from 'rc-slider'
import AddedBy from 'components/added-by'
import VotedBy from 'components/voted-by'
import ProgressBar from 'components/progress-bar'
import defaultImage from './default-artwork.png'
import { flatten, mean } from 'lodash'
import 'rc-slider/assets/index.css'
import './styles.scss'

const marks = {
  0: {
    style: {
      color: 'red'
    },
    label: <Icon name='thumbs down' color='red' />
  },
  50: <Icon name='handshake' />,
  100: {
    style: {
      color: 'green'
    },
    label: <Icon name='thumbs up' color='green' />
  }
}

const spotifyLink = uri => {
  const code = uri.split(':').pop()
  return `https://open.spotify.com/track/${code}`
}

const AlbumDescription = props => {
  const year = ` (${props.album.year})`
  return <p>{props.album.name}{year}</p>
}

const noTrack = () => (
  <div className="c-nowPlaying">
    <div>
      <img className="c-nowPlaying__image" src={defaultImage} />
      <div className="c-nowPlaying__trackInfo">
        <h6>Now playing</h6>
        <h4>-</h4>
        <p>Drag some music here or press play.</p>
      </div>
    </div>
  </div>
)

const calcVoteAverage = data => {
  const votes = data.map(i => i.vote)
  if (votes.length < 1) return 0
  return mean(flatten(votes))
}

const voteHandleColor = total => {
  if (total > 50) return '#21ba45'
  if (total < 50) return 'red'
  return 'gray'
}

const TrackVotes = props => {
  if (!props.metrics) return null
  return <VotedBy total={props.metrics.votesAverage} show={props.metrics.votes > 0} ribbon />
}

const AddLabel = props => {
  return (
    <div className="c-nowPlaying__metaItem">
      <h6>Added</h6>
      {props.count}
    </div>
  )
}

const PlayLabel = (props) => {
  return (
    <div className="c-nowPlaying__metaItem">
      <h6>Played</h6>
      {props.metrics && props.metrics.plays}
    </div>
  )
}

const VoteLabel = (props) => {
  return (
    <div className="c-nowPlaying__metaItem">
      <h6>Votes</h6>
      {props.metrics && props.metrics.votes}
    </div>
  )
}

const CurrentTrack = props => {
  const { track, onVote, userID } = props
  if (!track) {
    return noTrack()
  }
  const maxRating = 10
  const { addedBy = [] } = track
  const votes = (addedBy[0] && addedBy[0].votes) || []
  const currentUserVoter = votes.find(u => u.user._id === userID)
  const currentUserVote = currentUserVoter ? currentUserVoter.vote : null
  const doVote = uri => rating => onVote(uri, rating / maxRating)

  return (
    <div className="c-nowPlaying">
      <div>
        <img
          src={track.image || defaultImage}
          className="c-nowPlaying__image"
        />
        <div className="c-nowPlaying__trackInfo">
          <div className="c-nowPlaying__rating"><TrackVotes metrics={track.metrics} /></div>
          <h6>Now playing</h6>
          <a className="h4" href={spotifyLink(track.uri)}
            target='_blank'
            rel='noopener noreferrer'>{track.name}</a>
          <p>{track.artist.name}</p>
          <AlbumDescription album={track.album} />
          <ProgressBar />
        </div>
      </div>
      <div>
        <div className='c-nowPlaying__votingWrapper'>
          <Slider
            disabled={!userID}
            dots
            value={currentUserVote}
            included={false}
            marks={marks}
            step={maxRating}
            onChange={doVote(track.uri)}
            handleStyle={{
              borderColor: voteHandleColor(currentUserVote),
              backgroundColor: voteHandleColor(currentUserVote)
            }}
          />
        </div>

        <div className='c-nowPlaying__metaWrapper'>
          <AddLabel count={addedBy.length} />
          <PlayLabel metrics={track.metrics} />
          <VoteLabel metrics={track.metrics} />
          <VotedBy size='mini' show={votes.length > 0} total={calcVoteAverage(votes)} votes={votes} />
          <AddedBy users={track.addedBy} />
        </div>
      </div>
    </div>
  )
}

CurrentTrack.propTypes = {
  userID: PropTypes.string,
  track: PropTypes.object,
  onVote: PropTypes.func
}

export default CurrentTrack

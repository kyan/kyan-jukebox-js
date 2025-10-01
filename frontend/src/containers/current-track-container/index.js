import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as voteActions from 'votes/actions'
import CurrentTrack from 'components/current-track'

export const CurrentTrackContainer = () => {
  const track = useSelector(state => state.track)
  const dispatch = useDispatch()

  return (
    <CurrentTrack
      userID={null}
      track={track}
      onVote={(uri, rating) => dispatch(voteActions.vote(uri, rating))}
    />
  )
}

export default CurrentTrackContainer

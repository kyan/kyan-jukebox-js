import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as voteActions from 'votes/actions'
import CurrentTrack from 'components/current-track'

export const CurrentTrackContainer = () => {
  const track = useSelector(state => state.track)
  const user = useSelector(state => state.settings.user)
  const dispatch = useDispatch()

  return (
    <CurrentTrack
      userID={user ? user._id : null}
      track={track}
      onVote={(uri, rating) => dispatch(voteActions.vote(uri, rating))}
    />
  )
}

export default CurrentTrackContainer

import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import GoogleAuthContext from 'contexts/google'
import * as voteActions from 'votes/actions'
import CurrentTrack from 'components/current-track'

export const CurrentTrackContainer = () => {
  const { googleUser } = useContext(GoogleAuthContext)
  const track = useSelector(state => state.track)
  const dispatch = useDispatch()

  return (
    <CurrentTrack
      userID={googleUser && googleUser.googleId}
      track={track}
      onVote={(uri, rating) => dispatch(voteActions.vote(uri, rating))}
    />
  )
}

export default CurrentTrackContainer

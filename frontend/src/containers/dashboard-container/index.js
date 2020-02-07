import React, { useEffect, useContext, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import SignInToken from 'utils/signin-token'
import GoogleAuthContext from 'contexts/google'
import * as actions from 'actions'
import * as searchActions from 'search/actions'
import Dashboard from 'dashboard'

export const DashboardContainer = () => {
  const jukebox = useSelector(state => state.jukebox)
  const tracklist = useSelector(state => state.tracklist)
  const currentTrack = useSelector(state => state.track)
  const dispatch = useDispatch()
  const { isSignedIn, googleUser } = useContext(GoogleAuthContext)
  const disable = !(isSignedIn && jukebox.mopidyOnline)
  const googleTokenId = useRef()
  const refreshTokenTimeoutID = useRef()
  const hasTokenChanged = (token) => token !== googleTokenId.current

  const onSearch = (query) => {
    const searchOptions = { offset: 0 }
    dispatch(searchActions.search(query, searchOptions))
    dispatch(searchActions.storeSearchQuery(query, searchOptions))
    dispatch(searchActions.toggleSearchSidebar(true))
  }

  useEffect(() => {
    dispatch(actions.wsConnect())

    /* istanbul ignore next */
    return () => {
      dispatch(actions.wsDisconnect())
    }
  }, [dispatch])

  if (isSignedIn && hasTokenChanged(googleUser.Zi.id_token)) {
    googleTokenId.current = googleUser.Zi.id_token
    refreshTokenTimeoutID.current = SignInToken.refresh(googleUser, (token) => {
      dispatch(actions.updateToken(token))
    })
    dispatch(actions.updateToken(googleTokenId.current))
  }

  if (!isSignedIn) {
    googleTokenId.current = undefined
    SignInToken.clear(refreshTokenTimeoutID.current)
    dispatch(actions.clearToken())
  }

  return (
    <Dashboard
      online={jukebox.online}
      disabled={disable}
      volume={jukebox.volume}
      playbackState={jukebox.playbackState}
      onPlay={() => dispatch(actions.startPlaying())}
      onStop={() => dispatch(actions.stopPlaying())}
      onPause={() => dispatch(actions.pausePlaying())}
      onNext={() => dispatch(actions.nextPlaying())}
      onPrevious={() => dispatch(actions.previousPlaying())}
      onVolumeChange={(evt) => dispatch(actions.setVolume(evt))}
      onDrop={
        /* istanbul ignore next */
        (_item, monitor) => {
          if (monitor) {
            dispatch(actions.addNewTrack(monitor.getItem().urls[0]))
          }
        }
      }
      onTracklistClear={() => dispatch(actions.clearTrackList())}
      onSearchClick={() => dispatch(searchActions.toggleSearchSidebar(true))}
      tracklist={tracklist}
      currentTrack={currentTrack}
      onRemoveTrack={
        /* istanbul ignore next */
        (evt) => dispatch(actions.removeFromTracklist(evt))
      }
      onArtistSearch={query => _ => onSearch(query)}
    />
  )
}

export default DragDropContext(HTML5Backend)(DashboardContainer)

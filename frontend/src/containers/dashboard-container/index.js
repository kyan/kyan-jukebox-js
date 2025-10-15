import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import usePageVisibility from 'hooks/usePageVisibility'

import * as actions from 'actions'
import * as searchActions from 'search/actions'
import Dashboard from 'dashboard'
import LoginModal from 'components/login-modal'

export const DashboardContainer = () => {
  const isVisible = usePageVisibility()
  const settings = useSelector(state => state.settings)
  const jukebox = useSelector(state => state.jukebox)
  const tracklist = useSelector(state => state.tracklist)
  const currentTrack = useSelector(state => state.track)
  const dispatch = useDispatch()
  const disable = !jukebox.mopidyOnline
  const [showLoginModal, setShowLoginModal] = useState(false)

  const isSignedIn = settings.isSignedIn
  const authError = settings.authError

  useEffect(() => {
    dispatch(actions.wsConnect())

    /* istanbul ignore next */
    return () => dispatch(actions.wsDisconnect())
  }, [dispatch])

  useEffect(() => {
    // Show login modal if not signed in
    if (!isSignedIn && isVisible) {
      setShowLoginModal(true)
    } else if (isSignedIn) {
      // User successfully signed in, store in localStorage and close modal
      if (settings.user) {
        window.localStorage.setItem('jukebox_user', JSON.stringify(settings.user))
        setShowLoginModal(false)
        // Clear any auth errors on successful login
        dispatch(actions.setAuthError(null))
      }
    }
  }, [isSignedIn, isVisible, settings.user, dispatch])

  const handleLogin = useCallback(
    async userData => {
      // Clear any previous errors
      dispatch(actions.setAuthError(null))
      // Set user as validating (not signed in yet) with just email
      // Fullname and picture will come from backend
      dispatch(actions.validateUser(userData.email, { email: userData.email }))
      // Send a validation request to backend
      // The backend will respond with USER_NOT_FOUND if invalid
      // or success with full user data, which will trigger the confirmed login
      dispatch(actions.validateUserRequest())
    },
    [dispatch]
  )

  const handleSignOut = useCallback(() => {
    window.localStorage.removeItem('jukebox_user')
    dispatch(actions.clearUser())
    dispatch(actions.setAuthError(null))
    setShowLoginModal(true)
  }, [dispatch])

  // Try to restore user from localStorage on mount
  useEffect(() => {
    const storedUser = window.localStorage.getItem('jukebox_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        dispatch(actions.updateUser(userData.email, userData))
      } catch (error) {
        window.localStorage.removeItem('jukebox_user')
      }
    }
  }, [dispatch])

  const onPlay = useCallback(() => dispatch(actions.startPlaying()), [dispatch])
  const onStop = useCallback(() => dispatch(actions.stopPlaying()), [dispatch])
  const onPause = useCallback(() => dispatch(actions.pausePlaying()), [dispatch])
  const onNext = useCallback(() => dispatch(actions.nextPlaying()), [dispatch])
  const onPrevious = useCallback(() => dispatch(actions.previousPlaying()), [dispatch])
  const onVolumeChange = useCallback(evt => dispatch(actions.setVolume(evt)), [dispatch])

  const onTracklistClear = useCallback(() => dispatch(actions.clearTrackList()), [dispatch])
  const onSearchClick = useCallback(
    () => dispatch(searchActions.toggleSearchSidebar(true)),
    [dispatch]
  )
  const onRemoveTrack = useCallback(evt => dispatch(actions.removeFromTracklist(evt)), [dispatch])
  const onArtistSearch = useCallback(
    query => _evt => {
      const searchOptions = { offset: 0 }
      dispatch(searchActions.search(query, searchOptions))
      dispatch(searchActions.storeSearchQuery(query, searchOptions))
      dispatch(searchActions.toggleSearchSidebar(true))
    },
    [dispatch]
  )

  return (
    <>
      <LoginModal open={showLoginModal} onSubmit={handleLogin} error={authError} />
      <Dashboard
        online={jukebox.online}
        disabled={disable}
        onPlay={onPlay}
        onStop={onStop}
        onPause={onPause}
        onNext={onNext}
        onPrevious={onPrevious}
        onVolumeChange={onVolumeChange}
        onTracklistClear={onTracklistClear}
        onSearchClick={onSearchClick}
        tracklist={tracklist}
        currentTrack={currentTrack}
        onRemoveTrack={onRemoveTrack}
        onArtistSearch={onArtistSearch}
        user={settings.user}
        isSignedIn={isSignedIn}
        onSignOut={handleSignOut}
      />
    </>
  )
}

export default DashboardContainer

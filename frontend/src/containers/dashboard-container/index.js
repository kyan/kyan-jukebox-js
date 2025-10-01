import React, { useCallback, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import usePageVisibility from 'hooks/usePageVisibility'
// import { DragDropContext } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
import Notify from 'utils/notify'
import * as actions from 'actions'
import * as searchActions from 'search/actions'
import Dashboard from 'dashboard'

export const DashboardContainer = () => {
  const isVisible = usePageVisibility()
  const settings = useSelector(state => state.settings)
  const jukebox = useSelector(state => state.jukebox)
  const tracklist = useSelector(state => state.tracklist)
  const currentTrack = useSelector(state => state.track)
  const dispatch = useDispatch()
  const disable = !jukebox.mopidyOnline

  useEffect(() => {
    dispatch(actions.wsConnect())

    /* istanbul ignore next */
    return () => dispatch(actions.wsDisconnect())
  }, [dispatch])

  const onPlay = useCallback(() => dispatch(actions.startPlaying()), [dispatch])
  const onStop = useCallback(() => dispatch(actions.stopPlaying()), [dispatch])
  const onPause = useCallback(() => dispatch(actions.pausePlaying()), [dispatch])
  const onNext = useCallback(() => dispatch(actions.nextPlaying()), [dispatch])
  const onPrevious = useCallback(() => dispatch(actions.previousPlaying()), [dispatch])
  const onVolumeChange = useCallback(evt => dispatch(actions.setVolume(evt)), [dispatch])
  /* istanbul ignore next */
  const onDrop = useCallback(
    (_item, monitor) => {
      const urls = monitor
        .getItem()
        .urls[0].split('https://')
        .map(url => {
          return 'https://' + url
        })
        .slice(1)
      if (monitor) {
        if (urls.length <= 5) {
          urls.forEach(url => {
            dispatch(actions.addNewTrack(url))
          })
        } else {
          Notify.warning({
            title: 'Oops',
            message: 'You can only add a maximum of 5 tracks at a time!'
          })
        }
      }
    },
    [dispatch]
  )
  const onTracklistClear = useCallback(() => dispatch(actions.clearTrackList()), [dispatch])
  const onSearchClick = useCallback(
    () => dispatch(searchActions.toggleSearchSidebar(true)),
    [dispatch]
  )
  const onRemoveTrack = useCallback(evt => dispatch(actions.removeFromTracklist(evt)), [dispatch])
  const onArtistSearch = useCallback(
    query => _ => {
      const searchOptions = { offset: 0 }
      dispatch(searchActions.search(query, searchOptions))
      dispatch(searchActions.storeSearchQuery(query, searchOptions))
      dispatch(searchActions.toggleSearchSidebar(true))
    },
    [dispatch]
  )

  return (
    <Dashboard
      online={jukebox.online}
      disabled={disable}
      onPlay={onPlay}
      onStop={onStop}
      onPause={onPause}
      onNext={onNext}
      onPrevious={onPrevious}
      onVolumeChange={onVolumeChange}
      onDrop={onDrop}
      onTracklistClear={onTracklistClear}
      onSearchClick={onSearchClick}
      tracklist={tracklist}
      currentTrack={currentTrack}
      onRemoveTrack={onRemoveTrack}
      onArtistSearch={onArtistSearch}
    />
  )
}

// export default DragDropContext(HTML5Backend)(DashboardContainer)
export default DashboardContainer

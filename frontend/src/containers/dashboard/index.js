import React, { useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Dimmer, Divider, Grid, Header } from 'semantic-ui-react'
import GoogleAuthContext from '../../contexts/google'
import VolumeButtons from '../../components/volume-buttons'
import ClearPlaylist from '../../components/clear-playlist'
import * as actions from '../../actions'
import CurrentTrackContainer from '../current-track-container'
import Settings from '../../components/settings'
import TrackList from '../../components/tracklist'
import { getTracklistImagesInCache } from '../../selectors'
import Controls from '../../components/controls'
import DragInTrack from '../../components/drag-in-track'

export const Dashboard = () => {
  const jukebox = useSelector(state => state.jukebox)
  const tracklist = useSelector(state => state.tracklist)
  const currentTrack = useSelector(state => state.track)
  const tracklistImages = useSelector(state => getTracklistImagesInCache(state))
  const dispatch = useDispatch()
  const { isSignedIn, googleUser } = useContext(GoogleAuthContext)

  useEffect(() => {
    dispatch(actions.wsConnect())

    /* istanbul ignore next */
    return () => {
      dispatch(actions.wsDisconnect())
    }
  }, [dispatch])

  if (isSignedIn) {
    dispatch(actions.updateToken(googleUser.tokenId))
  } else {
    dispatch(actions.clearToken())
  }

  return (
    <Dimmer.Dimmable
      blurring
      className='jukebox-dashboard'
      dimmed={!jukebox.online}
    >
      <Settings />
      <VolumeButtons
        disabled={!isSignedIn}
        volume={jukebox.volume}
        onVolumeChange={(evt) => dispatch(actions.setVolume(evt))}
      />
      <Controls
        disabled={!isSignedIn}
        playbackState={jukebox.playbackState}
        onPlay={() => dispatch(actions.startPlaying())}
        onPause={() => dispatch(actions.pausePlaying())}
        onNext={() => dispatch(actions.nextPlaying())}
        onPrevious={() => dispatch(actions.previousPlaying())}
      />
      <Divider />
      <Grid>
        <Grid.Column width={6}>
          <DragInTrack
            disabled={!isSignedIn}
            onDrop={
              /* istanbul ignore next */
              (_item, monitor) => {
                if (monitor) {
                  dispatch(actions.addNewTrack(monitor.getItem().urls[0]))
                }
              }
            }
          >
            <Header size='small'>Current Track</Header>
            <CurrentTrackContainer />
          </DragInTrack>
        </Grid.Column>
        <Grid.Column width={10}>
          <Header size='small'>
            Playlist <ClearPlaylist
              disabled={!isSignedIn}
              onClear={() => dispatch(actions.clearTrackList())}
            />
          </Header>
          <TrackList
            disabled={!isSignedIn}
            images={tracklistImages}
            tracks={tracklist}
            currentTrack={currentTrack}
            onRemoveTrack={
              /* istanbul ignore next */
              (evt) => dispatch(actions.removeFromTracklist(evt))
            }
          />
        </Grid.Column>
      </Grid>
    </Dimmer.Dimmable>
  )
}

export default DragDropContext(HTML5Backend)(Dashboard)

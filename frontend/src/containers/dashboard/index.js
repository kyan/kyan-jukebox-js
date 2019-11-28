import React, { useEffect, useContext, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Dimmer, Divider, Grid, Header } from 'semantic-ui-react'
import SignInToken from '../../utils/signin-token'
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
  const disable = !(isSignedIn && jukebox.mopidyOnline)
  const googleTokenId = useRef()
  const refreshTokenTimeoutID = useRef()
  const hasTokenChanged = (token) => token !== googleTokenId.current

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
    <Dimmer.Dimmable
      blurring
      className='jukebox-dashboard'
      dimmed={!jukebox.online}
    >
      <Settings />
      <VolumeButtons
        disabled={disable}
        volume={jukebox.volume}
        onVolumeChange={(evt) => dispatch(actions.setVolume(evt))}
      />
      <Controls
        disabled={disable}
        playbackState={jukebox.playbackState}
        onPlay={() => dispatch(actions.startPlaying())}
        onStop={() => dispatch(actions.stopPlaying())}
        onPause={() => dispatch(actions.pausePlaying())}
        onNext={() => dispatch(actions.nextPlaying())}
        onPrevious={() => dispatch(actions.previousPlaying())}
      />
      <Divider />
      <Grid columns={2}>
        <Grid.Column width={4}>
          <DragInTrack
            disabled={disable}
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
        <Grid.Column width={12}>
          <Header size='small'>
            Playlist <ClearPlaylist
              disabled={disable}
              onClear={() => dispatch(actions.clearTrackList())}
            />
          </Header>
          <TrackList
            disabled={disable}
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

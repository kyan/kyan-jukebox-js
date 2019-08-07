import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Dimmer, Divider, Grid, Header } from 'semantic-ui-react'
import VolumeButtons from '../../components/volume-buttons'
import ClearPlaylist from '../../components/clear-playlist'
import * as actions from '../../actions'
import CurrentTrackContainer from '../current-track-container'
import Settings from '../settings'
import TrackList from '../../components/tracklist'
import { getTracklistImagesInCache } from '../../selectors'
import Controls from '../../components/controls'
import DragInTrack from '../../components/drag-in-track'
import RadioStream from '../../components/radio-stream'

const radioStream = (jukebox) => {
  if (!jukebox.radioStreamEnabled) { return null }
  return <RadioStream active={jukebox.radioStreamPlaying} />
}

export const Dashboard = () => {
  const jukebox = useSelector(state => state.jukebox)
  const settings = useSelector(state => state.settings)
  const tracklist = useSelector(state => state.tracklist)
  const currentTrack = useSelector(state => state.track)
  const tracklistImages = useSelector(state => getTracklistImagesInCache(state))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.wsConnect())

    /* istanbul ignore next */
    return () => {
      dispatch(actions.wsDisconnect())
    }
  }, [dispatch])

  return (
    <Dimmer.Dimmable
      blurring
      className='jukebox-dashboard'
      dimmed={!jukebox.online}
    >
      <Settings />
      <VolumeButtons
        disabled={!settings.token}
        volume={jukebox.volume}
        onVolumeChange={(evt) => dispatch(actions.setVolume(evt))}
      />
      <Controls
        radioEnabled={jukebox.radioStreamEnabled}
        radioPlaying={jukebox.radioStreamPlaying}
        disabled={!settings.token}
        playbackState={jukebox.playbackState}
        onPlay={() => dispatch(actions.startPlaying())}
        onPause={() => dispatch(actions.pausePlaying())}
        onNext={() => dispatch(actions.nextPlaying())}
        onPrevious={() => dispatch(actions.previousPlaying())}
        onStreaming={() => dispatch(actions.toggleStreamingState())}
      />
      <Divider />
      <Grid>
        <Grid.Column width={6}>
          <DragInTrack
            disabled={!settings.token}
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
              disabled={!settings.token}
              onClear={() => dispatch(actions.clearTrackList())}
            />
          </Header>
          <TrackList
            disabled={!settings.token}
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
      {radioStream(jukebox)}
    </Dimmer.Dimmable>
  )
}

export default DragDropContext(HTML5Backend)(Dashboard)

import React from 'react'
import { Dimmer, Divider, Grid, Header } from 'semantic-ui-react'
import Controls from 'components/controls'
import DragInTrack from 'components/drag-in-track'
import CurrentTrackContainer from 'containers/current-track-container'
import Settings from 'components/settings'
import TrackList from 'components/tracklist'
import VolumeButtons from 'components/volume-buttons'
import ClearPlaylist from 'components/clear-playlist'
import './index.css'

const Dashboard = (props) => {
  const {
    online,
    disabled,
    volume,
    playbackState,
    onPlay,
    onStop,
    onPause,
    onNext,
    onPrevious,
    onVolumeChange,
    onDrop,
    onTracklistClear,
    trackListImages,
    tracklist,
    currentTrack,
    onRemoveTrack
  } = props

  return (
    <Dimmer.Dimmable
      blurring
      className='jukebox-dashboard'
      dimmed={!online}
    >
      <Settings />
      <VolumeButtons
        disabled={disabled}
        volume={volume}
        onVolumeChange={onVolumeChange}
      />
      <Controls
        disabled={disabled}
        playbackState={playbackState}
        onPlay={onPlay}
        onStop={onStop}
        onPause={onPause}
        onNext={onNext}
        onPrevious={onPrevious}
      />
      <Divider />
      <Grid columns={2}>
        <Grid.Column width={4}>
          <DragInTrack
            disabled={disabled}
            onDrop={onDrop}
          >
            <Header size='small'>Current Track</Header>
            <CurrentTrackContainer />
          </DragInTrack>
        </Grid.Column>
        <Grid.Column width={12}>
          <Header size='small'>
            Playlist <ClearPlaylist
              disabled={disabled}
              onClear={onTracklistClear}
            />
          </Header>
          <TrackList
            disabled={disabled}
            images={trackListImages}
            tracks={tracklist}
            currentTrack={currentTrack}
            onRemoveTrack={onRemoveTrack}
          />
        </Grid.Column>
      </Grid>
    </Dimmer.Dimmable>
  )
}

export default Dashboard

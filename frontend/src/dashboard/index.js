import React from 'react'
import { Dimmer, Divider, Grid, Header, Container } from 'semantic-ui-react'
import Controls from 'components/controls'
import DragInTrack from 'components/drag-in-track'
import CurrentTrackContainer from 'containers/current-track-container'
import Settings from 'components/settings'
import TrackList from 'components/tracklist'
import SearchButton from 'search/components/button'
import VolumeButtons from 'components/volume-buttons'
import ClearPlaylist from 'components/clear-playlist'
import SearchContainer from 'search'
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
    onSearchClick,
    tracklist,
    currentTrack,
    onRemoveTrack
  } = props

  return (
    <Dimmer.Dimmable
      blurring
      dimmed={!online}
    >
      <SearchContainer>
        <Container className='header-wrapper' fluid>
          <Settings />
          <VolumeButtons
            disabled={disabled}
            volume={volume}
            onVolumeChange={onVolumeChange}
          />
          <SearchButton
            onClick={onSearchClick}
            disabled={disabled}
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
        </Container>
        <Divider />
        <Container className='body-wrapper' fluid>
          <Grid stackable columns={2} className='dashboard-grid'>
            <Grid.Column width={4}>
              <DragInTrack
                disabled={disabled}
                onDrop={onDrop}
              >
                <Header size='small'>Current Track</Header>
                <CurrentTrackContainer />
              </DragInTrack>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header size='small'>
                Playlist <ClearPlaylist
                  disabled={disabled}
                  onClear={onTracklistClear}
                />
              </Header>
              <TrackList
                disabled={disabled}
                tracks={tracklist}
                currentTrack={currentTrack}
                onRemoveTrack={onRemoveTrack}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </SearchContainer>
    </Dimmer.Dimmable>
  )
}

export default Dashboard

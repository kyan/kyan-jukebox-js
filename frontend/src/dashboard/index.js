import React from 'react'
import { Dimmer, Divider, Header } from 'semantic-ui-react'
import Controls from 'components/controls'
import DragInTrack from 'components/drag-in-track'
import CurrentTrackContainer from 'containers/current-track-container'
import Settings from 'components/settings'
import TrackList from 'components/tracklist'
import SearchButton from 'search/components/button'
import VolumeButtons from 'components/volume-buttons'
import ClearPlaylist from 'components/clear-playlist'
import SearchContainer from 'search'
import './index.scss'

const Dashboard = props => {
  const {
    online,
    disabled,
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
    onRemoveTrack,
    onArtistSearch
  } = props

  return (
    <Dimmer.Dimmable blurring dimmed={!online}>
      <DragInTrack disabled={disabled} onDrop={onDrop}>
        <SearchContainer>
          <div className='header-wrapper'>
            <Settings />
            <VolumeButtons disabled={disabled} onVolumeChange={onVolumeChange} />
            <SearchButton onClick={onSearchClick} disabled={disabled} />
            <Controls
              disabled={disabled}
              onPlay={onPlay}
              onStop={onStop}
              onPause={onPause}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          </div>
          <Divider />
          <div className='jukeboxWrapper'>
            <aside>
              <Header size='small'>Current Track</Header>
              <CurrentTrackContainer />
            </aside>
            <section>
              <Header size='small'>
                Playlist <ClearPlaylist disabled={disabled} onClear={onTracklistClear} />
              </Header>
              <TrackList
                disabled={disabled}
                tracks={tracklist}
                currentTrack={currentTrack}
                onRemoveTrack={onRemoveTrack}
                onArtistSearch={onArtistSearch}
              />
            </section>
          </div>
        </SearchContainer>
      </DragInTrack>
    </Dimmer.Dimmable>
  )
}

export default Dashboard

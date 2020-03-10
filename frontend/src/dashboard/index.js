import React from 'react'
import { Dimmer } from 'semantic-ui-react'
import Controls from 'components/controls'
import DragInTrack from 'components/drag-in-track'
import CurrentTrackContainer from 'containers/current-track-container'
import Settings from 'components/settings'
import TrackList from 'components/tracklist'
import SearchButton from 'search/components/button'
import VolumeButtons from 'components/volume-buttons'
import ClearPlaylist from 'components/clear-playlist'
import SearchContainer from 'search'
import './styles.scss'

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
          <div className='c-header'>
            <Controls
              disabled={disabled}
              onPlay={onPlay}
              onStop={onStop}
              onPause={onPause}
              onNext={onNext}
              onPrevious={onPrevious}
            />

            <div className='c-header__actions'>
              <Settings />
              <VolumeButtons
                disabled={disabled}
                onVolumeChange={onVolumeChange}
              />
              <SearchButton
                onClick={onSearchClick}
                disabled={disabled}
              />
            </div>
          </div>
          <div className='c-main'>
            <div className='c-main__nowPlaying'>
              <h6 size='small'>Now playing</h6>
              <CurrentTrackContainer />
            </div>
            <div className='c-main__trackList'>
              <h6>
                Tracklist <ClearPlaylist disabled={disabled} onClear={onTracklistClear} />
              </h6>
              <TrackList
                disabled={disabled}
                tracks={tracklist}
                currentTrack={currentTrack}
                onRemoveTrack={onRemoveTrack}
                onArtistSearch={onArtistSearch}
              />
            </div>
          </div>
        </SearchContainer>
      </DragInTrack>
    </Dimmer.Dimmable>
  )
}

export default Dashboard

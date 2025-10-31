import React from 'react'
import Controls from '@/components/controls'
import CurrentTrackContainer from '@/containers/current-track-container'
import Settings from '@/components/settings'
import TrackList from '@/components/tracklist'
import SearchButton from '@/search/components/button'
import VolumeButtons from '@/components/volume-buttons'
import ClearPlaylist from '@/components/clear-playlist'
import SearchContainer from '@/search'

interface DashboardProps {
  online: boolean
  disabled: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  onVolumeChange: (volume: number) => void
  onTracklistClear: (event: React.MouseEvent) => void
  onSearchClick: () => void
  tracklist?: any[]
  currentTrack?: any
  onRemoveTrack: (uri: string) => void
  onArtistSearch: (artistName: string) => () => void
  user?: any
  isSignedIn: boolean
  onSignOut: () => void
}

const Dashboard: React.FC<DashboardProps> = props => {
  const {
    online,
    disabled,
    onPlay,
    onPause,
    onNext,
    onPrevious,
    onVolumeChange,
    onTracklistClear,
    onSearchClick,
    tracklist,
    currentTrack,
    onRemoveTrack,
    onArtistSearch,
    user,
    isSignedIn,
    onSignOut
  } = props

  return (
    <div className='dashboard'>
      {/* Offline Dimmer Overlay */}
      {!online && (
        <div className='dashboard-offline-overlay'>
          <div className='dashboard-offline-content'>
            <div className='dashboard-offline-icon-wrapper'>
              <div className='dashboard-offline-icon-circle'>
                <svg
                  className='dashboard-offline-icon'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414'
                  />
                </svg>
              </div>
            </div>
            <h2 className='dashboard-offline-title'>Offline</h2>
            <p className='dashboard-offline-message'>Waiting for connection...</p>
          </div>
        </div>
      )}

      <SearchContainer>
        {/* Header Section */}
        <div className='dashboard-header'>
          <div className='dashboard-header-inner'>
            <div className='dashboard-header-controls'>
              <Settings user={user} isSignedIn={isSignedIn} onSignOut={onSignOut} />
              <div className='dashboard-divider'></div>
              <VolumeButtons disabled={disabled} onVolumeChange={onVolumeChange} />
              <div className='dashboard-divider'></div>
              <Controls
                disabled={disabled}
                onPlay={onPlay}
                onPause={onPause}
                onNext={onNext}
                onPrevious={onPrevious}
              />
              <div className='dashboard-spacer'></div>
              <SearchButton onClick={onSearchClick} disabled={disabled} />
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className='dashboard-body'>
          <div className='dashboard-container'>
            <div className='dashboard-grid'>
              {/* Now Playing Column */}
              <div className='dashboard-now-playing'>
                <div className='dashboard-now-playing-sticky'>
                  <div className='dashboard-section-header'>
                    <div className='dashboard-section-accent'></div>
                    <h2 className='dashboard-section-title'>Now Playing</h2>
                  </div>
                  <CurrentTrackContainer />
                </div>
              </div>

              {/* Playlist Column */}
              <div className='dashboard-playlist'>
                <div className='dashboard-section-header dashboard-section-header--space-between'>
                  <div className='dashboard-section-header-group'>
                    <div className='dashboard-section-accent'></div>
                    <h2 className='dashboard-section-title'>Playlist</h2>
                  </div>
                  <ClearPlaylist disabled={disabled} onClear={onTracklistClear} />
                </div>
                <div className='dashboard-playlist-wrapper'>
                  <TrackList
                    disabled={disabled}
                    tracks={tracklist}
                    currentTrack={currentTrack}
                    onRemoveTrack={onRemoveTrack}
                    onArtistSearch={onArtistSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SearchContainer>
    </div>
  )
}

export default Dashboard

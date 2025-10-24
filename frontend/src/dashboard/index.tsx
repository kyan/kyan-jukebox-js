import React from 'react'
import { Separator } from 'components/ui/separator'
import Controls from 'components/controls'
import CurrentTrackContainer from 'containers/current-track-container'
import Settings from 'components/settings'
import TrackList from 'components/tracklist'
import SearchButton from 'search/components/button'
import VolumeButtons from 'components/volume-buttons'
import ClearPlaylist from 'components/clear-playlist'
import SearchContainer from 'search'

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
    <div className='relative min-h-screen'>
      {/* Offline Dimmer Overlay */}
      {!online && (
        <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in'>
          <div className='text-center animate-pulse-slow'>
            <h2 className='text-2xl font-semibold mb-2'>Offline</h2>
            <p className='text-muted-foreground'>Waiting for connection...</p>
          </div>
        </div>
      )}

      <SearchContainer>
        {/* Header Section */}
        <div className='w-full px-5 sm:px-8 pt-5 pb-2.5 animate-slide-down'>
          <div className='flex flex-wrap items-center gap-4'>
            <Settings user={user} isSignedIn={isSignedIn} onSignOut={onSignOut} />
            <VolumeButtons disabled={disabled} onVolumeChange={onVolumeChange} />
            <SearchButton onClick={onSearchClick} disabled={disabled} />
            <Controls
              disabled={disabled}
              onPlay={onPlay}
              onPause={onPause}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          </div>
        </div>

        <Separator className='transition-colors' />

        {/* Body Section */}
        <div className='w-full px-4 sm:px-5 pt-2.5 pb-5'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen'>
            {/* Now Playing Column */}
            <div className='lg:col-span-4 animate-fade-in' style={{ animationDelay: '0.1s' }}>
              <h2 className='text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide'>
                Now Playing
              </h2>
              <div className='transition-all duration-300'>
                <CurrentTrackContainer />
              </div>
            </div>

            {/* Playlist Column */}
            <div className='lg:col-span-8 animate-fade-in' style={{ animationDelay: '0.2s' }}>
              <div className='flex items-center gap-2 mb-4'>
                <h2 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                  Playlist
                </h2>
                <ClearPlaylist disabled={disabled} onClear={onTracklistClear} />
              </div>
              <div className='transition-all duration-300'>
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
      </SearchContainer>
    </div>
  )
}

export default Dashboard

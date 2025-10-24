import React from 'react'
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
    <div className='relative min-h-screen bg-gradient-to-br from-background via-background to-muted/10'>
      {/* Offline Dimmer Overlay */}
      {!online && (
        <div className='fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in'>
          <div className='text-center animate-pulse bg-card border border-border rounded-lg p-8 shadow-2xl'>
            <div className='mb-4 flex justify-center'>
              <div className='h-16 w-16 rounded-full bg-muted flex items-center justify-center'>
                <svg
                  className='h-8 w-8 text-muted-foreground'
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
            <h2 className='text-3xl font-bold mb-2 text-foreground'>Offline</h2>
            <p className='text-muted-foreground text-lg'>Waiting for connection...</p>
          </div>
        </div>
      )}

      <SearchContainer>
        {/* Header Section */}
        <div className='sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm'>
          <div className='w-full px-6 sm:px-8 py-4'>
            <div className='flex flex-wrap items-center gap-3 justify-center sm:justify-start h-[45px]'>
              <Settings user={user} isSignedIn={isSignedIn} onSignOut={onSignOut} />
              <div className='h-6 w-px bg-border hidden sm:block'></div>
              <VolumeButtons disabled={disabled} onVolumeChange={onVolumeChange} />
              <div className='h-6 w-px bg-border hidden sm:block'></div>
              <Controls
                disabled={disabled}
                onPlay={onPlay}
                onPause={onPause}
                onNext={onNext}
                onPrevious={onPrevious}
              />
              <div className='flex-1'></div>
              <SearchButton onClick={onSearchClick} disabled={disabled} />
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className='w-full px-4 sm:px-6 lg:px-8 py-8'>
          <div className='max-w-[1800px] mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
              {/* Now Playing Column */}
              <div className='lg:col-span-5 xl:col-span-4'>
                <div className='sticky top-24'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='h-8 w-1 bg-primary rounded-full'></div>
                    <h2 className='text-lg font-bold text-foreground tracking-tight'>
                      Now Playing
                    </h2>
                  </div>
                  <div className='transform transition-all duration-300 hover:scale-[1.01]'>
                    <CurrentTrackContainer />
                  </div>
                </div>
              </div>

              {/* Playlist Column */}
              <div className='lg:col-span-7 xl:col-span-8'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center gap-3'>
                    <div className='h-8 w-1 bg-primary rounded-full'></div>
                    <h2 className='text-lg font-bold text-foreground tracking-tight'>Playlist</h2>
                  </div>
                  <ClearPlaylist disabled={disabled} onClear={onTracklistClear} />
                </div>
                <div className='bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 shadow-lg'>
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

import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Dashboard from './index'

describe('Dashboard', () => {
  const onPlayMock = mock(() => {}).mockName('onPlayMock')
  const onStopMock = mock(() => {}).mockName('onStopMock')
  const onPauseMock = mock(() => {}).mockName('onPauseMock')
  const onNextMock = mock(() => {}).mockName('onNextMock')
  const onPreviousMock = mock(() => {}).mockName('onPreviousMock')
  const onVolumeChangeMock = mock(() => {}).mockName('onVolumeChangeMock')

  const onTracklistClearMock = mock(() => {}).mockName('onTracklistClearMock')
  const onRemoveTrackMock = mock(() => {}).mockName('onRemoveTrackMock')
  const onArtistSearch = mock(() => {}).mockName('onArtistSearch')
  const onSearchClickMock = mock(() => {}).mockName('onSearchClickMock')

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render', () => {
    it('renders the happy path correctly', () => {
      const mockStore = configureMockStore()
      const store = mockStore({
        search: {
          searchSideBarOpen: false,
          searchResults: [],
          searchInProgress: false
        },
        curatedList: {
          tracks: []
        },
        timer: { duration: 0, position: 0, remaining: 0 },
        jukebox: {
          volume: 50
        },
        settings: {
          email: null,
          user: null,
          isSignedIn: false,
          isValidating: false,
          authError: null
        },
        track: null
      })

      const props = {
        online: true,
        disabled: false,
        onPlay: onPlayMock,
        onStop: onStopMock,
        onPause: onPauseMock,
        onNext: onNextMock,
        onPrevious: onPreviousMock,
        onVolumeChange: onVolumeChangeMock,

        onTracklistClear: onTracklistClearMock,
        onRemoveTrack: onRemoveTrackMock,
        onArtistSearch: onArtistSearch,
        onSearchClick: onSearchClickMock,
        trackListImages: {},
        tracklist: [
          {
            name: 'track1',
            uri: 'spotify:track:1',
            artist: { name: 'Artist 1' },
            album: { name: 'Album 1' },
            length: 180000,
            addedBy: []
          },
          {
            name: 'track2',
            uri: 'spotify:track:2',
            artist: { name: 'Artist 2' },
            album: { name: 'Album 2' },
            length: 200000,
            addedBy: []
          }
        ],
        currentTrack: { name: 'track1', uri: 'spotify:track:1', artist: { name: 'Artist 1' } }
      }

      const { container } = render(
        <Provider store={store}>
          <Dashboard {...props} />
        </Provider>
      )
      expect(container).toBeInTheDocument()
    })
  })
})

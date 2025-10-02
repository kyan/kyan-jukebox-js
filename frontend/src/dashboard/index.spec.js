import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Dashboard from './index'

describe('Dashboard', () => {
  const onPlayMock = jest.fn().mockName('onPlayMock')
  const onStopMock = jest.fn().mockName('onStopMock')
  const onPauseMock = jest.fn().mockName('onPauseMock')
  const onNextMock = jest.fn().mockName('onNextMock')
  const onPreviousMock = jest.fn().mockName('onPreviousMock')
  const onVolumeChangeMock = jest.fn().mockName('onVolumeChangeMock')

  const onTracklistClearMock = jest.fn().mockName('onTracklistClearMock')
  const onRemoveTrackMock = jest.fn().mockName('onRemoveTrackMock')
  const onArtistSearch = jest.fn().mockName('onArtistSearch')
  const onSearchClickMock = jest.fn().mockName('onSearchClickMock')

  beforeEach(() => {
    jest.clearAllMocks()
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
        }
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

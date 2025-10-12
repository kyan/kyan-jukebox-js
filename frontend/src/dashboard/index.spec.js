import React from 'react'
import { shallow } from 'enzyme'
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
        tracklist: ['track1', 'track2'],
        currentTrack: { title: 'track1' }
      }
      const wrapper = shallow(<Dashboard {...props} />)
      expect(wrapper).toMatchSnapshot()
    })
  })
})

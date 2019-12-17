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
  const onDropMock = jest.fn().mockName('onDropMock')
  const onTracklistClearMock = jest.fn().mockName('onTracklistClearMock')
  const onRemoveTrackMock = jest.fn().mockName('onRemoveTrackMock')
  const onSearchClickMock = jest.fn().mockName('onSearchClickMock')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    it('renders the happy path correctly', () => {
      const props = {
        online: true,
        disabled: false,
        volume: 23,
        playbackState: 'playing',
        onPlay: onPlayMock,
        onStop: onStopMock,
        onPause: onPauseMock,
        onNext: onNextMock,
        onPrevious: onPreviousMock,
        onVolumeChange: onVolumeChangeMock,
        onDrop: onDropMock,
        onTracklistClear: onTracklistClearMock,
        onRemoveTrack: onRemoveTrackMock,
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

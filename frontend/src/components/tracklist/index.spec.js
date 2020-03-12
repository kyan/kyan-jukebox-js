import React from 'react'
import { shallow, mount } from 'enzyme'
import Tracklist from './index'
import MockTrackListJson from '__mockData__/api'

describe('Tracklist', () => {
  let tracks = MockTrackListJson()
  tracks[0].track.metrics = null

  const onRemoveMock = jest.fn()
  const onSearchMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    Date.now = jest.fn(() => { return 8208000 })

    describe('when disabled', () => {
      const wrapper = shallow(
        <Tracklist
          disabled
          tracks={tracks.map(item => item.track)}
          currentTrack={tracks[0].track}
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )

      it('renders the as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when enabled', () => {
      const wrapper = shallow(
        <Tracklist
          disabled={false}
          tracks={tracks.map(item => item.track)}
          currentTrack={tracks[0].track}
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )

      it('renders the as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    it('removes a track', () => {
      const wrapper = mount(
        <Tracklist
          tracks={tracks.map(item => item.track)}
          currentTrack={tracks[0].track}
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )

      wrapper.find('ActionRemove').at(2).childAt(0).props().onClick()
      expect(onRemoveMock).toHaveBeenCalled()
    })

    it('searches for an artist', () => {
      const wrapper = mount(
        <Tracklist
          tracks={tracks.map(item => item.track)}
          currentTrack={tracks[1].track}
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )

      wrapper.find('.track-search-link').at(1).simulate('click')
      expect(onSearchMock).toHaveBeenCalledWith('Ken Dodd')
    })
  })

  describe('when no track', () => {
    it('renders nothing', () => {
      const wrapper = shallow(
        <Tracklist
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )

      expect(wrapper.instance()).toBeNull()
    })
  })

  describe('tracklist but nothing cued up', () => {
    it('does not mark anything as current', () => {
      const wrapper = shallow(
        <Tracklist
          tracks={tracks.map(item => item.track)}
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('tracklist has track with no addedBy data', () => {
    it('does nothing', () => {
      const track = tracks[0].track
      delete track.addedBy

      const wrapper = shallow(
        <Tracklist
          tracks={[track]}
          onRemoveTrack={onRemoveMock}
          onArtistSearch={onSearchMock}
        />
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
})

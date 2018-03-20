import React from 'react'
import { shallow, mount } from 'enzyme'
import Tracklist from './index'
import MockTrackListJson from '../../__mockData__/api'

describe('Tracklist', () => {
  let wrapper
  let tracks = MockTrackListJson()
  const images = {
    'spotify:album:5OVGwMCexoHavOar6v4al5': 'album-image.jpg'
  }
  const onRemoveMock = jest.fn()

  describe('render', () => {
    Date.now = jest.fn(() => { return 8208000 })

    wrapper = shallow(
      <Tracklist
        tracks={tracks.map(item => item.track)}
        images={images}
        currentTrack={tracks[0].track}
        onRemoveTrack={onRemoveMock}
      />
    )

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('removes a track', () => {
      wrapper = mount(
        <Tracklist
          tracks={tracks.map(item => item.track)}
          images={images}
          currentTrack={tracks[0].track}
          onRemoveTrack={onRemoveMock}
        />
      )

      wrapper.find('.item').at(1).find('a').simulate('click')
      expect(onRemoveMock.mock.calls.length).toEqual(1)
      expect(onRemoveMock.mock.calls[0][0]).toEqual('local:track:Soundtracks/Silent%20Running%20OST/Silent%20Running%20')
    })
  })

  describe('when no track', () => {
    it('renders nothing', () => {
      wrapper = shallow(
        <Tracklist
          onRemoveTrack={onRemoveMock}
        />
      )

      expect(wrapper.instance()).toBeNull()
    })
  })

  describe('tracklist but nothing cued up', () => {
    it('does not mark anything as current', () => {
      wrapper = shallow(
        <Tracklist
          tracks={tracks.map(item => item.track)}
          onRemoveTrack={onRemoveMock}
        />
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
})

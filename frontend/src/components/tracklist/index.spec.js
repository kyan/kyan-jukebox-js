import React from 'react'
import { shallow } from 'enzyme'
import Tracklist from './index'
import MockTrackListJson from '../../__mockData__/api'

describe('Tracklist', () => {
  let wrapper
  let tracks = MockTrackListJson()
  const images = {
    'spotify:album:5OVGwMCexoHavOar6v4al5': 'album-image.jpg'
  }

  describe('render', () => {
    Date.now = jest.fn(() => { return 8208000 })

    wrapper = shallow(
      <Tracklist
        tracks={tracks.map(item => item.track)}
        images={images}
        currentTrack={tracks[0].track}
      />
    )

    it('renders the as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when no track', () => {
    it('renders nothing', () => {
      wrapper = shallow(
        <Tracklist />
      )

      expect(wrapper.instance()).toBeNull()
    })
  })
})

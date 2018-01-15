import React from 'react'
import { shallow } from 'enzyme'
import CurrentTrack from './index'

describe('CurrentTrack', () => {
  let wrapper, track, image

  beforeEach(() => {
    track = {
      name: 'My Track Title',
      length: 12999,
      artist: {
        name: 'Artist Name'
      },
      album: {
        name: 'Album Name',
        date: 2007
      }
    }
    image = 'path/to/image'
  })

  describe('render', () => {
    it('renders the as expected', () => {
      wrapper = shallow(
        <CurrentTrack
          track={track}
          image={image}
          progress={25}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('when no track', () => {
    it('renders nothing', () => {
      wrapper = shallow(
        <CurrentTrack
          image={image}
          progress={25}
        />
      )

      expect(wrapper.instance()).toBeNull()
    })
  })

  describe('when there is no album date', () => {
    it('does not render the date or the brackets', () => {
      track.album.date = null

      wrapper = shallow(
        <CurrentTrack
          track={track}
          image={image}
          progress={25}
        />
      )

      expect(wrapper.html()).not.toContain('(2007)')
    })
  })
})

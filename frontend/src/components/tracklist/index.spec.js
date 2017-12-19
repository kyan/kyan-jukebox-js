import React from 'react'
import { shallow } from 'enzyme'
import Tracklist from './index'

describe('Tracklist', () => {
  let wrapper
  let tracks = [
    {
      uri: 'track1',
      name: 'Track Title 1',
      length: 12999,
      artist: {
        name: 'Artist Name 1'
      },
      album: {
        uri: 'album1',
        name: 'Album Name 1'
      }
    },
    {
      uri: 'track2',
      name: 'Track Title 2',
      length: 22999,
      artist: {
        name: 'Artist Name 2'
      },
      album: {
        uri: 'album2',
        name: 'Album Name 2'
      }
    }
  ]
  const images = {
    'album1': 'path/to/image'
  }

  describe('render', () => {
    wrapper = shallow(
      <Tracklist
        tracks={tracks}
        images={images}
        currentTrack={tracks[0]}
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

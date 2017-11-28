import React from 'react'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import CurrentTrack from './index'

describe('CurrentTrack', () => {
  let wrapper
  let track = {
    name: 'My Track Title',
    length: 12999,
    artist: {
      name: 'Artist Name'
    },
    album: {
      name: 'Album Name'
    }
  }
  const image = 'path/to/image'

  describe('render', () => {
    wrapper = shallow(
      <CurrentTrack
        track={ track }
        image={ image }
        progress={ 25 }
      />
    )

    it('renders the as expected', () => {
      expect(shallowToJson(wrapper)).toMatchSnapshot()
    })
  })
})

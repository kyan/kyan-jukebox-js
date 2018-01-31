import React from 'react'
import { shallow } from 'enzyme'
import CurrentTrack from './index'
import { Card } from 'semantic-ui-react'
import MockTrackListJson from '../../__mockData__/api'

describe('CurrentTrack', () => {
  let wrapper, track, image

  beforeEach(() => {
    image = 'path/to/image'
  })

  describe('render', () => {
    describe('album', () => {
      it('renders track', () => {
        track = MockTrackListJson()[0]
        wrapper = shallow(
          <CurrentTrack
            track={track}
            image={image}
            progress={25}
          />
        )

        expect(wrapper).toMatchSnapshot()
      })

      it('renders no album date if not available', () => {
        track = MockTrackListJson()[0]
        delete track.album.year
        wrapper = shallow(
          <CurrentTrack
            track={track}
            image={image}
            progress={25}
          />
        )

        expect(wrapper.find(Card.Description).html())
          .not.toContain(MockTrackListJson()[0].album.year)
      })
    })

    describe('composer', () => {
      it('renders track', () => {
        track = MockTrackListJson()[1]
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
})

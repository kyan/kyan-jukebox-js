import React from 'react'
import { shallow, mount } from 'enzyme'
import { Image } from 'semantic-ui-react'
import MockTrackListJson from '__mockData__/api'
import CurrentTrack from './index'

describe('CurrentTrack', () => {
  let wrapper, track

  describe('render', () => {
    describe('album', () => {
      it('renders track', () => {
        const voteMock = jest.fn()
        track = MockTrackListJson()[1].track
        delete track.album.year
        wrapper = mount(
          <CurrentTrack
            userID='1117795953801840xxxxx'
            track={track}
            progress={25}
            remaining={5}
            onVote={voteMock}
          />
        )

        expect(wrapper).toMatchSnapshot()
        wrapper.find('RatingIcon').at(3).simulate('click')
        expect(voteMock).toHaveBeenCalledWith('spotify:track:6BitwTrBfUrTdztRrQiw52', 4)
      })
    })
  })

  describe('when no track', () => {
    it('renders nothing', () => {
      wrapper = shallow(
        <CurrentTrack />
      )

      expect(wrapper.instance()).toBeNull()
    })
  })

  describe('when no image', () => {
    it('renders default image', () => {
      track = MockTrackListJson()[0].track
      wrapper = shallow(
        <CurrentTrack
          track={track}
          progress={25}
        />
      )

      expect(wrapper.find(Image)).toMatchSnapshot()
    })
  })

  describe('when missing data', () => {
    it('renders defaults', () => {
      track = MockTrackListJson()[2].track
      delete track.addedBy
      delete track.album
      wrapper = shallow(
        <CurrentTrack
          track={track}
          progress={25}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})

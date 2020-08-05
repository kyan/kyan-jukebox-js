import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import { Image } from 'semantic-ui-react'
import keyCode from 'rc-util/lib/KeyCode'
import configureMockStore from 'redux-mock-store'
import MockTrackListJson from '__mockData__/api'
import CurrentTrack from './index'

describe('CurrentTrack', () => {
  let wrapper, track

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    describe('album', () => {
      it('renders track', () => {
        const voteMock = jest.fn()
        track = MockTrackListJson()[1].track
        track.metrics = null
        const store = configureMockStore()({
          timer: { duration: 10000, position: 8000, remaining: 700 },
          track
        })
        delete track.album.year
        wrapper = mount(
          <Provider store={store}>
            <CurrentTrack
              userID='1117795953801840xxxxx'
              track={track}
              progress={25}
              remaining={5}
              onVote={voteMock}
            />
          </Provider>
        )

        expect(wrapper).toMatchSnapshot()
        const handler = wrapper.find('.rc-slider-handle').at(1)
        wrapper.simulate('focus')
        handler.simulate('keyDown', { keyCode: keyCode.UP })
        expect(voteMock).toHaveBeenCalledWith('spotify:track:6BitwTrBfUrTdztRrQiw52', 5)
      })

      it('renders and average vote that was < 50', () => {
        const voteMock = jest.fn()
        track = MockTrackListJson()[0].track
        const store = configureMockStore()({
          timer: { duration: 10000, position: 8000, remaining: 700 },
          track
        })
        delete track.album.year
        wrapper = mount(
          <Provider store={store}>
            <CurrentTrack
              userID='1117795953801840xxxxx'
              track={track}
              progress={25}
              remaining={5}
              onVote={voteMock}
            />
          </Provider>
        )

        expect(wrapper.find('.track-rating-container')).toMatchSnapshot()
      })

      it('renders and average vote that was 0', () => {
        const voteMock = jest.fn()
        track = MockTrackListJson()[2].track
        const store = configureMockStore()({
          timer: { duration: 10000, position: 8000, remaining: 700 },
          track
        })
        delete track.album.year
        wrapper = mount(
          <Provider store={store}>
            <CurrentTrack
              userID='1117795953801840xxxxx'
              track={track}
              progress={25}
              remaining={5}
              onVote={voteMock}
            />
          </Provider>
        )

        expect(wrapper.find('.track-rating-container')).toMatchSnapshot()
      })
    })
  })

  describe('when no track', () => {
    it('renders nothing', () => {
      wrapper = shallow(<CurrentTrack />)

      expect(wrapper.instance()).toBeNull()
    })
  })

  describe('when no image', () => {
    it('renders default image', () => {
      track = MockTrackListJson()[0].track
      wrapper = shallow(<CurrentTrack track={track} progress={25} />)

      expect(wrapper.find(Image)).toMatchSnapshot()
    })
  })

  describe('when missing data', () => {
    it('renders defaults', () => {
      track = MockTrackListJson()[2].track
      delete track.addedBy
      delete track.album
      wrapper = shallow(<CurrentTrack track={track} progress={25} />)

      expect(wrapper).toMatchSnapshot()
    })
  })
})

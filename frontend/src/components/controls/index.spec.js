import React from 'react'
import { shallow } from 'enzyme'
import MopidyApi from '../../constants/mopidy-api'
import Controls from './index'

describe('Controls', () => {
  const onPlayMock = jest.fn()
  const onStopMock = jest.fn()
  const onPrevMock = jest.fn()
  const onNextMock = jest.fn()

  describe('render', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('when controls disabled', () => {
      const wrapper = shallow(
        <Controls
          playbackState={MopidyApi.PAUSED}
          disabled
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when no playstate', () => {
      const wrapper = shallow(
        <Controls
          disabled
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when controls enabled', () => {
      const wrapper = shallow(
        <Controls
          playbackState={MopidyApi.PLAYING}
          disabled={false}
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('handles a play click', () => {
        wrapper.find('.jb-play-button').simulate('click')
        expect(onPlayMock.mock.calls.length).toEqual(1)
      })
    })
  })
})

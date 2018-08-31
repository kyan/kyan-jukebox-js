import React from 'react'
import { shallow } from 'enzyme'
import Controls from './index'

describe('Controls', () => {
  const onPlayMock = jest.fn()
  const onPauseMock = jest.fn()
  const onPrevMock = jest.fn()
  const onNextMock = jest.fn()

  describe('render', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('when controls disabled', () => {
      const state = {
        radioStreamPlaying: false,
        playbackState: false
      }
      const wrapper = shallow(
        <Controls
          disabled
          state={state}
          onPlay={onPlayMock}
          onPause={onPauseMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when controls enabled', () => {
      const state = {
        radioStreamPlaying: false,
        playbackState: true
      }
      const wrapper = shallow(
        <Controls
          disabled={false}
          state={state}
          onPlay={onPlayMock}
          onPause={onPauseMock}
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

    describe('when streaming radio', () => {
      const state = {
        radioStreamPlaying: true,
        playbackState: true
      }
      const wrapper = shallow(
        <Controls
          disabled={false}
          state={state}
          onPlay={onPlayMock}
          onPause={onPauseMock}
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

import React from 'react'
import { shallow } from 'enzyme'
import MopidyApi from '../../constants/mopidy-api'
import Controls from './index'

describe('Controls', () => {
  const onPlayMock = jest.fn()
  const onStopMock = jest.fn()
  const onPauseMock = jest.fn()
  const onPrevMock = jest.fn()
  const onNextMock = jest.fn()

  describe('render', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('when paused', () => {
      const wrapper = shallow(
        <Controls
          playbackState={MopidyApi.PAUSED}
          disabled={false}
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPause={onPauseMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when stopped', () => {
      const wrapper = shallow(
        <Controls
          playbackState={MopidyApi.STOPPED}
          disabled={false}
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPause={onPauseMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when disabled', () => {
      const wrapper = shallow(
        <Controls
          playbackState={MopidyApi.PLAYING}
          disabled
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPause={onPauseMock}
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
          disabled={false}
          onPlay={onPlayMock}
          onStop={onStopMock}
          onPause={onPauseMock}
          onPrevious={onPrevMock}
          onNext={onNextMock}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when playing', () => {
      const wrapper = shallow(
        <Controls
          playbackState={MopidyApi.PLAYING}
          disabled={false}
          onPlay={onPlayMock}
          onStop={onStopMock}
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
        expect(onPlayMock).toHaveBeenCalled()
      })

      it('handles a stop click', () => {
        wrapper.find('.jb-stop-button').simulate('click')
        expect(onStopMock).toHaveBeenCalled()
      })

      it('handles a pause click', () => {
        wrapper.find('.jb-pause-button').simulate('click')
        expect(onPauseMock).toHaveBeenCalled()
      })
    })
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import MopidyApi from '../../constants/mopidy-api'
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
      const wrapper = shallow(
        <Controls
          disabled
          state={MopidyApi.PAUSED}
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
      const wrapper = shallow(
        <Controls
          disabled={false}
          state={MopidyApi.PAUSED}
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

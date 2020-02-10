import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import MopidyApi from 'constants/mopidy-api'
import Controls from './index'

describe('Controls', () => {
  const onPlayMock = jest.fn()
  const onStopMock = jest.fn()
  const onPauseMock = jest.fn()
  const onPrevMock = jest.fn()
  const onNextMock = jest.fn()

  describe('render', () => {
    const mockStore = configureMockStore()
    const buildControl = (store, props) => (
      mount(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onStop={onStopMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={false}
            {...props}
          />
        </Provider>
      )
    )

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('state when paused', () => {
      it('you can play', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PAUSED } })
        const wrapper = buildControl(store)

        wrapper.find('PlayButton').simulate('click')
        expect(onPlayMock).toHaveBeenCalled()
      })

      it('you can stop', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PAUSED } })
        const wrapper = buildControl(store)

        wrapper.find('StopButton').simulate('click')
        expect(onStopMock).toHaveBeenCalled()
      })

      it('you cannot pause again', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PAUSED } })
        const wrapper = buildControl(store)

        wrapper.find('PauseButton').simulate('click')
        expect(onPauseMock).not.toHaveBeenCalled()
      })

      it('you can skip', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PAUSED } })
        const wrapper = buildControl(store)

        wrapper.find('SkipButtons').prop('onPrevious')()
        expect(onPrevMock).toHaveBeenCalled()
        wrapper.find('SkipButtons').prop('onNext')()
        expect(onNextMock).toHaveBeenCalled()
      })
    })

    describe('state when stopped', () => {
      it('you can play', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store)

        wrapper.find('PlayButton').simulate('click')
        expect(onPlayMock).toHaveBeenCalled()
      })

      it('you cannot stop again', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store)

        wrapper.find('StopButton').simulate('click')
        expect(onStopMock).not.toHaveBeenCalled()
      })

      it('you cannot pause again', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store)

        wrapper.find('PauseButton').simulate('click')
        expect(onPauseMock).not.toHaveBeenCalled()
      })

      it('you can skip', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store)

        wrapper.find('SkipButtons').prop('onPrevious')()
        expect(onPrevMock).toHaveBeenCalled()
        wrapper.find('SkipButtons').prop('onNext')()
        expect(onNextMock).toHaveBeenCalled()
      })
    })

    describe('state when playing', () => {
      it('you cannot play again', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PLAYING } })
        const wrapper = buildControl(store)

        wrapper.find('PlayButton').simulate('click')
        expect(onPlayMock).not.toHaveBeenCalled()
      })

      it('you can stop', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PLAYING } })
        const wrapper = buildControl(store)

        wrapper.find('StopButton').simulate('click')
        expect(onStopMock).toHaveBeenCalled()
      })

      it('you can pause', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PLAYING } })
        const wrapper = buildControl(store)

        wrapper.find('PauseButton').simulate('click')
        expect(onPauseMock).toHaveBeenCalled()
      })

      it('you can skip', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.PLAYING } })
        const wrapper = buildControl(store)

        wrapper.find('SkipButtons').prop('onPrevious')()
        expect(onPrevMock).toHaveBeenCalled()
        wrapper.find('SkipButtons').prop('onNext')()
        expect(onNextMock).toHaveBeenCalled()
      })
    })

    describe('state when disabled', () => {
      it('you cannot play', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store, { disabled: true })

        wrapper.find('PlayButton').simulate('click')
        expect(onPlayMock).not.toHaveBeenCalled()
      })

      it('you cannot stop', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store, { disabled: true })

        wrapper.find('StopButton').simulate('click')
        expect(onStopMock).not.toHaveBeenCalled()
      })

      it('you cannot pause', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store, { disabled: true })

        wrapper.find('PauseButton').simulate('click')
        expect(onPauseMock).not.toHaveBeenCalled()
      })

      it('you cannot skip', () => {
        const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
        const wrapper = buildControl(store, { disabled: true })

        expect(wrapper.find('SkipButtons').prop('disabled')).toEqual(true)
      })
    })
  })
})

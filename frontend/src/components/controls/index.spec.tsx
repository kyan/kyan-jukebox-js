import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureMockStore from 'redux-mock-store'
import MopidyApi from 'constants/mopidy-api'
import Controls from './index'

describe('Controls', () => {
  const onPlayMock = jest.fn()
  const onPauseMock = jest.fn()
  const onPrevMock = jest.fn()
  const onNextMock = jest.fn()

  const mockStore = configureMockStore()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('state when paused', () => {
    it('you can play', () => {
      const store = mockStore({ jukebox: { playbackState: MopidyApi.PAUSED } })
      const { getByTestId } = render(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={false}
          />
        </Provider>
      )

      userEvent.click(getByTestId('PlayButton'))
      expect(onPlayMock).toHaveBeenCalled()
    })

    it('you can skip', () => {
      const store = mockStore({ jukebox: { playbackState: MopidyApi.PAUSED } })
      const { getByTestId } = render(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={false}
          />
        </Provider>
      )

      userEvent.click(getByTestId('NextButton'))
      expect(onNextMock).toHaveBeenCalled()
      userEvent.click(getByTestId('PreviousButton'))
      expect(onPrevMock).toHaveBeenCalled()
    })
  })

  describe('state when playing', () => {
    it('you can pause', () => {
      const store = mockStore({ jukebox: { playbackState: MopidyApi.PLAYING } })
      const { getByTestId } = render(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={false}
          />
        </Provider>
      )

      userEvent.click(getByTestId('PlayButton'))
      expect(onPauseMock).toHaveBeenCalled()
    })

    it('you can skip', () => {
      const store = mockStore({ jukebox: { playbackState: MopidyApi.PLAYING } })
      const { getByTestId } = render(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={false}
          />
        </Provider>
      )

      userEvent.click(getByTestId('NextButton'))
      expect(onNextMock).toHaveBeenCalled()
      userEvent.click(getByTestId('PreviousButton'))
      expect(onPrevMock).toHaveBeenCalled()
    })
  })

  describe('state when disabled', () => {
    it('you cannot play or pause', () => {
      const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
      const { getByTestId } = render(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={true}
          />
        </Provider>
      )

      userEvent.click(getByTestId('PlayButton'))
      expect(onPauseMock).not.toHaveBeenCalled()
      expect(onPlayMock).not.toHaveBeenCalled()
    })

    it('you cannot skip', () => {
      const store = mockStore({ jukebox: { playbackState: MopidyApi.STOPPED } })
      const { getByTestId } = render(
        <Provider store={store}>
          <Controls
            onPlay={onPlayMock}
            onPause={onPauseMock}
            onPrevious={onPrevMock}
            onNext={onNextMock}
            disabled={true}
          />
        </Provider>
      )

      userEvent.click(getByTestId('NextButton'))
      expect(onNextMock).not.toHaveBeenCalled()
      userEvent.click(getByTestId('PreviousButton'))
      expect(onPrevMock).not.toHaveBeenCalled()
    })
  })
})

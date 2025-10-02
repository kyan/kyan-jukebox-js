import React from 'react'
import { Provider } from 'react-redux'
import { render, cleanup } from '@testing-library/react'
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

  afterEach(() => {
    cleanup()
  })

  describe('state when paused', () => {
    it('you can play', async () => {
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

      await userEvent.click(getByTestId('PlayButton'))
      expect(onPlayMock).toHaveBeenCalled()
    })

    it('you can skip', async () => {
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

      await userEvent.click(getByTestId('SkipButton--forward'))
      expect(onNextMock).toHaveBeenCalled()
      await userEvent.click(getByTestId('SkipButton--backward'))
      expect(onPrevMock).toHaveBeenCalled()
    })
  })

  describe('state when playing', () => {
    it('you can pause', async () => {
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

      await userEvent.click(getByTestId('PlayButton'))
      expect(onPauseMock).toHaveBeenCalled()
    })

    it('you can skip', async () => {
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

      await userEvent.click(getByTestId('SkipButton--forward'))
      expect(onNextMock).toHaveBeenCalled()
      await userEvent.click(getByTestId('SkipButton--backward'))
      expect(onPrevMock).toHaveBeenCalled()
    })
  })

  describe('state when disabled', () => {
    it('you cannot play or pause', async () => {
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

      await userEvent.click(getByTestId('PlayButton'))
      expect(onPauseMock).not.toHaveBeenCalled()
      expect(onPlayMock).not.toHaveBeenCalled()
    })

    it('you cannot skip', async () => {
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

      await userEvent.click(getByTestId('SkipButton--forward'))
      expect(onNextMock).not.toHaveBeenCalled()
      await userEvent.click(getByTestId('SkipButton--backward'))
      expect(onPrevMock).not.toHaveBeenCalled()
    })
  })
})

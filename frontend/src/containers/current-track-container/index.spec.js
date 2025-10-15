import { describe, it, expect, beforeEach } from 'bun:test'
import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CurrentTrackContainer from './index'

describe('CurrentTrackContainer', () => {
  const mockStore = configureMockStore()

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render the connected app', () => {
    it('renders something even when no track is available', () => {
      const store = mockStore({
        track: {},
        timer: { duration: 0, position: 0, remaining: 0 },
        jukebox: { mopidyOnline: true },
        settings: { user: null, isSignedIn: false }
      })

      const { container } = render(
        <Provider store={store}>
          <CurrentTrackContainer />
        </Provider>
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders with track data', () => {
      const store = mockStore({
        track: {
          name: 'Test Song',
          uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          artist: { name: 'Test Artist' },
          album: { name: 'Test Album' },
          length: 180000
        },
        timer: { duration: 180000, position: 60000, remaining: 120000 },
        jukebox: { mopidyOnline: true },
        settings: {
          user: { _id: '1117795953801840xxxxx', fullname: 'Test User', email: 'test@example.com' },
          isSignedIn: true
        }
      })

      const { container } = render(
        <Provider store={store}>
          <CurrentTrackContainer />
        </Provider>
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders when mopidy is offline', () => {
      const store = mockStore({
        track: {},
        timer: { duration: 0, position: 0, remaining: 0 },
        jukebox: { mopidyOnline: false },
        settings: { user: null, isSignedIn: false }
      })

      const { container } = render(
        <Provider store={store}>
          <CurrentTrackContainer />
        </Provider>
      )

      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

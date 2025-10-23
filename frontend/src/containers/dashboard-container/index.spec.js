import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import DashboardContainer from './index'

mock.module('utils/notify', () => ({}))
mock.module('hooks/usePageVisibility', () => () => true)

describe('DashboardContainer', () => {
  const mockStore = configureMockStore()

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mock(() => {}),
        setItem: mock(() => {}),
        removeItem: mock(() => {}),
        clear: mock(() => {})
      },
      writable: true
    })
  })

  describe('online', () => {
    describe('logged out', () => {
      it('renders as expected', () => {
        const store = mockStore({
          settings: {
            isSignedIn: false,
            user: null,
            authError: null
          },
          jukebox: {
            online: true,
            mopidyOnline: true,
            volume: 50
          },
          tracklist: [],
          track: {},
          timer: { duration: 0, position: 0, remaining: 0 },
          search: {
            searchSideBarOpen: false,
            searchResults: [],
            searchInProgress: false
          },
          curatedList: {
            tracks: []
          }
        })

        const { container } = render(
          <Provider store={store}>
            <DashboardContainer />
          </Provider>
        )

        expect(container.firstChild).toBeInTheDocument()
      })
    })

    describe('logged in', () => {
      const mockUser = {
        email: 'test@example.com',
        fullname: 'Test User',
        picture: 'https://example.com/avatar.jpg'
      }

      it('renders as expected', () => {
        const store = mockStore({
          settings: {
            isSignedIn: true,
            user: mockUser,
            authError: null
          },
          jukebox: {
            online: true,
            mopidyOnline: true,
            volume: 50
          },
          tracklist: [],
          track: {},
          timer: { duration: 0, position: 0, remaining: 0 },
          search: {
            searchSideBarOpen: false,
            searchResults: [],
            searchInProgress: false
          },
          curatedList: {
            tracks: []
          }
        })

        const { container } = render(
          <Provider store={store}>
            <DashboardContainer />
          </Provider>
        )

        expect(container.firstChild).toBeInTheDocument()
      })

      it('should store user in localStorage on successful login', () => {
        const store = mockStore({
          settings: {
            isSignedIn: true,
            user: mockUser,
            authError: null
          },
          jukebox: {
            online: true,
            mopidyOnline: true,
            volume: 50
          },
          tracklist: [],
          track: {},
          timer: { duration: 0, position: 0, remaining: 0 },
          search: {
            searchSideBarOpen: false,
            searchResults: [],
            searchInProgress: false
          },
          curatedList: {
            tracks: []
          }
        })

        act(() => {
          render(
            <Provider store={store}>
              <DashboardContainer />
            </Provider>
          )
        })

        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          'jukebox_user',
          JSON.stringify(mockUser)
        )
      })

      it('should restore user from localStorage on mount', () => {
        window.localStorage.getItem.mockReturnValue(JSON.stringify(mockUser))

        const store = mockStore({
          settings: {
            isSignedIn: false,
            user: null,
            authError: null
          },
          jukebox: {
            online: true,
            mopidyOnline: true,
            volume: 50
          },
          tracklist: [],
          track: {},
          timer: { duration: 0, position: 0, remaining: 0 },
          search: {
            searchSideBarOpen: false,
            searchResults: [],
            searchInProgress: false
          },
          curatedList: {
            tracks: []
          }
        })

        render(
          <Provider store={store}>
            <DashboardContainer />
          </Provider>
        )

        expect(window.localStorage.getItem).toHaveBeenCalledWith('jukebox_user')
      })
    })

    describe('with auth error', () => {
      it('renders with auth error', () => {
        const store = mockStore({
          settings: {
            isSignedIn: false,
            user: null,
            authError: 'Invalid credentials'
          },
          jukebox: {
            online: true,
            mopidyOnline: true,
            volume: 50
          },
          tracklist: [],
          track: {},
          timer: { duration: 0, position: 0, remaining: 0 },
          search: {
            searchSideBarOpen: false,
            searchResults: [],
            searchInProgress: false
          },
          curatedList: {
            tracks: []
          }
        })

        const { container } = render(
          <Provider store={store}>
            <DashboardContainer />
          </Provider>
        )

        expect(container.firstChild).toBeInTheDocument()
      })
    })
  })

  describe('offline', () => {
    it('renders when offline', () => {
      const store = mockStore({
        settings: {
          isSignedIn: false,
          user: null,
          authError: null
        },
        jukebox: {
          online: false,
          mopidyOnline: false,
          volume: 50
        },
        tracklist: [],
        track: {},
        timer: { duration: 0, position: 0, remaining: 0 },
        search: {
          searchSideBarOpen: false,
          searchResults: [],
          searchInProgress: false
        },
        curatedList: {
          tracks: []
        }
      })

      const { container } = render(
        <Provider store={store}>
          <DashboardContainer />
        </Provider>
      )

      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

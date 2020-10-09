import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import * as actions from 'actions'
import * as searchActions from 'search/actions'
import GoogleAuthContext from 'contexts/google'
import DashboardContainer from './index'
jest.mock('utils/notify')

describe('DashboardContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'info').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
  })

  describe('online', () => {
    let mockActions, wrapper, store
    const mockStore = configureMockStore()

    describe('logged out', () => {
      it('renders as expected', () => {
        const data = {
          tracklist: [],
          jukebox: {
            volume: 25,
            online: true,
            playbackState: 'playing'
          },
          timer: {
            duration: 100,
            postion: 0
          },
          search: {
            searchSideBarOpen: false,
            results: []
          },
          curatedList: {
            tracks: []
          },
          settings: {
            token: null,
            tokenExpires: 0
          }
        }
        const mockGoogle = {
          isSignedIn: false,
          googleUser: null
        }
        store = mockStore(data)
        wrapper = mount(
          <Provider store={store}>
            <GoogleAuthContext.Provider value={mockGoogle}>
              <DashboardContainer />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        mockActions = store.getActions()
        expect(wrapper).toMatchSnapshot()

        expect(mockActions).toEqual([{ type: 'actionClearStoreToken' }, { type: 'actionConnect' }])

        const searchButton = wrapper.find('SearchButton')
        expect(searchButton.prop('onClick')()).toEqual(searchActions.toggleSearchSidebar(true))

        const control = wrapper.find('Controls')
        expect(control.prop('onPlay')()).toEqual(actions.startPlaying())
        expect(control.prop('onStop')()).toEqual(actions.stopPlaying())
        expect(control.prop('onPause')()).toEqual(actions.pausePlaying())
        expect(control.prop('onNext')()).toEqual(actions.nextPlaying())
        expect(control.prop('onPrevious')()).toEqual(actions.previousPlaying())

        const volume = wrapper.find('VolumeButtons')
        expect(volume.prop('onVolumeChange')(12)).toEqual(actions.setVolume(12))

        const clear = wrapper.find('ClearPlaylist')
        expect(clear.prop('onClear')()).toEqual(actions.clearTrackList())
      })
    })

    describe('logged in', () => {
      it('renders as expected', () => {
        const data = {
          tracklist: [],
          jukebox: {
            volume: 25,
            online: true,
            playbackState: 'playing'
          },
          timer: {
            duration: 100,
            postion: 0
          },
          search: {
            searchSideBarOpen: false,
            results: []
          },
          curatedList: {
            tracks: []
          },
          settings: {
            token: 'googlejwttoken123',
            tokenExpires: 0
          }
        }
        const mockGoogle = {
          isSignedIn: true,
          googleUser: {
            expiresAt: 12345,
            tokenId: 'googlejwttoken123',
            profileObj: {
              name: 'Fred Spanner',
              imageUrl: 'myImage123'
            }
          }
        }
        store = mockStore(data)
        wrapper = mount(
          <Provider store={store}>
            <GoogleAuthContext.Provider value={mockGoogle}>
              <DashboardContainer />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        mockActions = store.getActions()
        expect(wrapper).toMatchSnapshot()
        expect(mockActions).toEqual([
          { token: 'googlejwttoken123', tokenExpires: 12345, type: 'actionStoreToken' },
          { type: 'actionConnect' }
        ])

        store.clearActions()
        const control = wrapper.find('Controls')
        control.prop('onPlay')()
        control.prop('onStop')()
        control.prop('onPause')()
        control.prop('onNext')()
        control.prop('onPrevious')()
        mockActions = store.getActions()
        expect(mockActions).toEqual([
          { key: 'playback.play', type: 'actionSend' },
          { key: 'playback.stop', type: 'actionSend' },
          { key: 'playback.pause', type: 'actionSend' },
          { key: 'playback.next', type: 'actionSend' },
          { key: 'playback.previous', type: 'actionSend' }
        ])

        store.clearActions()
        wrapper.find('VolumeButtons').prop('onVolumeChange')(12)
        mockActions = store.getActions()
        expect(mockActions).toEqual([{ key: 'mixer.setVolume', params: [12], type: 'actionSend' }])

        store.clearActions()
        wrapper.find('ClearPlaylist').prop('onClear')()
        mockActions = store.getActions()
        expect(mockActions).toEqual([{ key: 'tracklist.clear', type: 'actionSend' }])

        store.clearActions()
        wrapper.find('Dashboard').prop('onRemoveTrack')('uri123')
        mockActions = store.getActions()
        expect(mockActions).toEqual([
          { key: 'tracklist.remove', type: 'actionSend', params: { criteria: { uri: ['uri123'] } } }
        ])

        store.clearActions()
        const dashboard = wrapper.find('Dashboard')
        dashboard.prop('onArtistSearch')('query')()
        mockActions = store.getActions()
        expect(mockActions).toEqual([
          {
            key: 'searchGetTracks',
            params: { options: { offset: 0 }, query: 'query' },
            type: 'actionTrackSearch'
          },
          { query: 'query', type: 'actionStoreSearchQuery' },
          { open: true, type: 'actionToggleSearchSidebar' }
        ])
      })

      it('should refresh the token', () => {
        const data = {
          tracklist: [],
          jukebox: {
            volume: 25,
            online: true,
            playbackState: 'playing'
          },
          timer: {
            duration: 100,
            postion: 0
          },
          search: {
            searchSideBarOpen: false,
            results: []
          },
          curatedList: {
            tracks: []
          },
          settings: {
            token: 'googlejwttoken123',
            tokenExpires: Date.now() - 5000000
          }
        }
        const mockGoogle = {
          isSignedIn: true,
          googleUser: {
            expiresAt: 12345,
            tokenId: 'googlejwttoken123',
            profileObj: {
              name: 'Fred Spanner',
              imageUrl: 'myImage123'
            }
          },
          auth2: {
            currentUser: {
              get: jest.fn(() => {
                return {
                  reloadAuthResponse: jest.fn().mockResolvedValue({
                    id_token: 'newtoken123',
                    expires_at: 12345678999987
                  })
                }
              })
            }
          }
        }
        store = mockStore(data)
        wrapper = mount(
          <Provider store={store}>
            <GoogleAuthContext.Provider value={mockGoogle}>
              <DashboardContainer />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        mockActions = store.getActions()
        expect(wrapper).toMatchSnapshot()

        return new Promise(resolve => {
          setTimeout(() => {
            expect(console.info).toHaveBeenCalledWith('Token Refreshed: ', 'newtoken123')
            expect(mockActions).toEqual([
              { type: 'actionConnect' },
              { type: 'actionStoreToken', token: 'newtoken123', tokenExpires: 12345678999987 }
            ])
            resolve()
          }, 0)
        })
      })

      it('should log error when refresh fails', () => {
        const data = {
          tracklist: [],
          jukebox: {
            volume: 25,
            online: true,
            playbackState: 'playing'
          },
          timer: {
            duration: 100,
            postion: 0
          },
          search: {
            searchSideBarOpen: false,
            results: []
          },
          curatedList: {
            tracks: []
          },
          settings: {
            token: 'googlejwttoken123',
            tokenExpires: Date.now() - 5000000
          }
        }
        const mockGoogle = {
          isSignedIn: true,
          googleUser: {
            expiresAt: 12345,
            tokenId: 'googlejwttoken123',
            profileObj: {
              name: 'Fred Spanner',
              imageUrl: 'myImage123'
            }
          },
          auth2: {
            currentUser: {
              get: jest.fn(() => {
                return {
                  reloadAuthResponse: jest.fn().mockRejectedValue(new Error('bang!'))
                }
              })
            }
          }
        }
        store = mockStore(data)
        wrapper = mount(
          <Provider store={store}>
            <GoogleAuthContext.Provider value={mockGoogle}>
              <DashboardContainer />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        mockActions = store.getActions()
        expect(wrapper).toMatchSnapshot()

        return new Promise(resolve => {
          setTimeout(() => {
            expect(console.warn).toHaveBeenCalledWith('Token un-refreshable: ', 'bang!')
            expect(mockActions).toEqual([{ type: 'actionConnect' }])
            resolve()
          }, 0)
        })
      })
    })
  })
})

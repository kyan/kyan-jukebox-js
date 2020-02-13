import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import * as actions from 'actions'
import * as searchActions from 'search/actions'
import GoogleAuthContext from 'contexts/google'
import SignInToken from 'utils/signin-token'
import DashboardContainer from './index'
jest.mock('utils/notify')
jest.mock('utils/signin-token')

describe('DashboardContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('online', () => {
    let mockActions, wrapper, store, data
    const mockStore = configureMockStore()
    data = {
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
      }
    }

    describe('logged out', () => {
      it('renders as expected', () => {
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

        expect(mockActions).toEqual([
          { type: 'actionClearStoreToken' },
          { type: 'actionConnect' }
        ])

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

        expect(SignInToken.clear.mock.calls.length).toEqual(1)
      })
    })

    describe('logged in', () => {
      it('renders as expected', () => {
        const mockGoogle = {
          isSignedIn: true,
          googleUser: {
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
          { token: 'googlejwttoken123', type: 'actionStoreToken' },
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
        expect(SignInToken.refresh.mock.calls.length).toEqual(1)
        expect(SignInToken.refresh.mock.calls[0][0]).toEqual(mockGoogle.googleUser)
        spyOn(actions, 'updateToken').and.callThrough()
        SignInToken.refresh.mock.calls[0][1]('token')
        mockActions = store.getActions()
        expect(mockActions).toEqual([{ token: 'token', type: 'actionStoreToken' }])

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
        expect(mockActions).toEqual([{ key: 'tracklist.remove', type: 'actionSend', params: { uri: ['uri123'] } }])

        store.clearActions()
        const dashboard = wrapper.find('Dashboard')
        dashboard.prop('onArtistSearch')('query')()
        mockActions = store.getActions()
        expect(mockActions).toEqual([
          { key: 'searchGetTracks', params: { options: { offset: 0 }, query: 'query' }, type: 'actionTrackSearch' },
          { query: 'query', type: 'actionStoreSearchQuery' },
          { open: true, type: 'actionToggleSearchSidebar' }])
      })
    })
  })
})

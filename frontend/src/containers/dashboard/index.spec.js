import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import * as actions from '../../actions'
import GoogleAuthContext from '../../contexts/google'
import SignInToken from '../../utils/signin-token'
import Dashboard from './index'
jest.mock('../../utils/notify')
jest.mock('../../utils/signin-token')

describe('Dashboard', () => {
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
              <Dashboard />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        mockActions = store.getActions()
        expect(wrapper).toMatchSnapshot()

        expect(mockActions).toEqual([
          { type: 'actionClearStoreToken' },
          { type: 'actionConnect' }
        ])

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
            Zi: {
              id_token: 'googlejwttoken123'
            },
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
              <Dashboard />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        mockActions = store.getActions()
        expect(wrapper).toMatchSnapshot()
        expect(mockActions).toEqual([
          { token: 'googlejwttoken123', type: 'actionStoreToken' },
          { type: 'actionConnect' }
        ])

        const control = wrapper.find('Controls')
        expect(control.prop('onPlay')()).toEqual(actions.startPlaying())
        expect(control.prop('onStop')()).toEqual(actions.stopPlaying())
        expect(control.prop('onPause')()).toEqual(actions.pausePlaying())
        expect(control.prop('onNext')()).toEqual(actions.nextPlaying())
        expect(control.prop('onPrevious')()).toEqual(actions.previousPlaying())

        expect(SignInToken.refresh.mock.calls.length).toEqual(1)
        expect(SignInToken.refresh.mock.calls[0][0]).toEqual(mockGoogle.googleUser)
        spyOn(actions, 'updateToken').and.callThrough()
        SignInToken.refresh.mock.calls[0][1]('token')
        expect(actions.updateToken).toHaveBeenCalledWith('token')

        const volume = wrapper.find('VolumeButtons')
        expect(volume.prop('onVolumeChange')(12)).toEqual(actions.setVolume(12))

        const clear = wrapper.find('ClearPlaylist')
        expect(clear.prop('onClear')()).toEqual(actions.clearTrackList())
      })
    })
  })
})

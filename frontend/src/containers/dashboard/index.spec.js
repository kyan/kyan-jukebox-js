import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import * as actions from '../../actions'
import GoogleAuthContext from '../../contexts/google'
import Dashboard from './index'
jest.mock('../../utils/notify')

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('online', () => {
    const mockStore = configureMockStore()
    let wrapper, store, data
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
    store = mockStore(data)

    describe('logged out', () => {
      it('renders as expected', () => {
        const mockGoogle = {
          isSignedIn: false,
          googleUser: null
        }
        wrapper = mount(
          <Provider store={store}>
            <GoogleAuthContext.Provider value={mockGoogle}>
              <Dashboard />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        expect(wrapper).toMatchSnapshot()

        const control = wrapper.find('Controls')
        expect(control.prop('onPlay')()).toEqual(actions.startPlaying())
        expect(control.prop('onStop')()).toEqual(actions.stopPlaying())
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
        const mockGoogle = {
          isSignedIn: true,
          googleUser: {
            profileObj: {
              name: 'Fred Spanner',
              imageUrl: 'myImage123'
            }
          }
        }
        wrapper = mount(
          <Provider store={store}>
            <GoogleAuthContext.Provider value={mockGoogle}>
              <Dashboard />
            </GoogleAuthContext.Provider>
          </Provider>
        )
        expect(wrapper).toMatchSnapshot()

        const control = wrapper.find('Controls')
        expect(control.prop('onPlay')()).toEqual(actions.startPlaying())
        expect(control.prop('onStop')()).toEqual(actions.stopPlaying())
        expect(control.prop('onNext')()).toEqual(actions.nextPlaying())
        expect(control.prop('onPrevious')()).toEqual(actions.previousPlaying())

        const volume = wrapper.find('VolumeButtons')
        expect(volume.prop('onVolumeChange')(12)).toEqual(actions.setVolume(12))

        const clear = wrapper.find('ClearPlaylist')
        expect(clear.prop('onClear')()).toEqual(actions.clearTrackList())
      })
    })
  })
})

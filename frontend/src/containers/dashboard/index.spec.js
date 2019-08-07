import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import * as actions from '../../actions'
import Dashboard from './index'
jest.mock('../../utils/notify')

describe('Dashboard', () => {
  describe('render the connected app', () => {
    const mockStore = configureMockStore()
    let wrapper, store, data
    data = {
      settings: {
        open: false
      },
      tracklist: [],
      jukebox: {
        volume: 25,
        online: true,
        playbackState: 'playing',
        radioStreamEnabled: true
      },
      timer: {
        duration: 100,
        postion: 0
      }
    }

    describe('render the connected app', () => {
      store = mockStore(data)
      wrapper = mount(
        <Provider store={store}>
          <Dashboard />
        </Provider>
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('handles the control actions', () => {
        const control = wrapper.find('Controls')
        expect(control.prop('onPlay')()).toEqual(actions.startPlaying())
        expect(control.prop('onPause')()).toEqual(actions.pausePlaying())
        expect(control.prop('onNext')()).toEqual(actions.nextPlaying())
        expect(control.prop('onPrevious')()).toEqual(actions.previousPlaying())
        expect(control.prop('onStreaming')()).toEqual(actions.toggleStreamingState())
      })

      it('handles the volume actions', () => {
        const control = wrapper.find('VolumeButtons')
        expect(control.prop('onVolumeChange')(12)).toEqual(actions.setVolume(12))
      })

      it('handles the clear playlist actions', () => {
        const control = wrapper.find('ClearPlaylist')
        expect(control.prop('onClear')()).toEqual(actions.clearTrackList())
      })
    })

    describe('when the radio is disabled', () => {
      beforeEach(() => {
        data.jukebox.radioStreamEnabled = false
        store = mockStore(data)
        wrapper = mount(
          <Provider store={store}>
            <Dashboard />
          </Provider>
        )
      })

      it('shows the button', () => {
        const control = wrapper.find('RadioStream')
        expect(control).toMatchSnapshot()
      })
    })
  })
})

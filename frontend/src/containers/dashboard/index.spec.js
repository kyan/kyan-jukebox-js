import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import notify from '../../utils/notify'
import * as actions from '../../actions'
import DashboardContainer, { Dashboard } from './index'
jest.mock('../../utils/notify')

describe('Dashboard', () => {
  let wrapper

  describe('render just the dashboard without redux', () => {
    const settings = { token: 'token' }
    const jukebox = {
      volume: 25,
      online: true,
      playbackState: 'playing',
      radioStreamEnabled: true
    }
    const currentTrack = {}
    const tracklist = []
    const tracklistImages = {}
    const dispatchMock = jest.fn()

    it('renders as expected', () => {
      wrapper = shallow(
        <Dashboard
          settings={settings}
          jukebox={jukebox}
          currentTrack={currentTrack}
          tracklist={tracklist}
          tracklistImages={tracklistImages}
          dispatch={dispatchMock}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })

    it('componentDidMount', () => {
      spyOn(actions, 'wsConnect')
      wrapper.instance().componentDidMount()
      expect(actions.wsConnect).toHaveBeenCalled()
    })

    it('componentWillUnmount', () => {
      spyOn(actions, 'wsDisconnect')
      wrapper.instance().componentWillUnmount()
      expect(actions.wsDisconnect).toHaveBeenCalled()
    })

    describe('fireDispatch', () => {
      it('handles startPlaying', () => {
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().fireDispatch('startPlaying')()
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::playback.play',
          type: 'actionSend'
        })
        expect(notify.mock.calls.length).toEqual(1)
        notify.mockClear()
      })

      it('handles pausePlaying', () => {
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().fireDispatch('pausePlaying')()
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::playback.pause',
          type: 'actionSend'
        })
        expect(notify.mock.calls.length).toEqual(1)
        notify.mockClear()
      })

      it('handles nextPlaying', () => {
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().fireDispatch('nextPlaying')()
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::playback.next',
          type: 'actionSend'
        })
      })

      it('handles previousPlaying', () => {
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().fireDispatch('previousPlaying')()
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::playback.previous',
          type: 'actionSend'
        })
      })

      it('handles clearTrackList', () => {
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().fireDispatch('clearTrackList')()
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::tracklist.clear',
          type: 'actionSend'
        })
      })

      it('handles removeFromTracklist', () => {
        const uri = 'spotify:track:1yzSSn5Sj1azuo7RgwvDb3'
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().fireDispatch('removeFromTracklist')(uri)
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::tracklist.remove',
          params: { uri: [uri] },
          type: 'actionSend'
        })
      })
    })

    describe('handleURLDrop', () => {
      const url = 'https://open.spotify.com/track/0c41pMosF5Kqwwegcps8ES'

      it('handles a monitor passed in', () => {
        spyOn(wrapper.instance(), 'dispatch')
        const monitor = {
          getItem: () => {
            return { urls: [url] }
          }
        }
        wrapper.instance().handleURLDrop(null, monitor)
        expect(wrapper.instance().dispatch).toHaveBeenCalledWith({
          key: 'mopidy::tracklist.add',
          params: { 'uri': 'spotify:track:0c41pMosF5Kqwwegcps8ES' },
          type: 'actionSend'
        })
      })

      it('handles a monitor not passed in', () => {
        spyOn(wrapper.instance(), 'dispatch')
        wrapper.instance().handleURLDrop(null, null)
        expect(wrapper.instance().dispatch).not.toHaveBeenCalled()
      })
    })
  })

  describe('render the connected app', () => {
    const store = configureMockStore()({
      settings: {
        open: false
      },
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
    })

    it('renders as expected', () => {
      wrapper = mount(
        <Provider store={store}>
          <DashboardContainer />
        </Provider>
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
})

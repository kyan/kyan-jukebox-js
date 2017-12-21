import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import configureMockStore from 'redux-mock-store'
import * as actions from '../../actions'
import DashboardContainer, { Dashboard } from './index'

describe('Dashboard', () => {
  let wrapper

  describe('render just the dashboard without redux', () => {
    const jukebox = { currentVolume: 25, online: true }
    const currentTrack = {}
    const tracklist = []
    const tracklistImages = {}
    const dispatchMock = jest.fn()

    it('renders as expected', () => {
      wrapper = shallow(
        <Dashboard
          jukebox={ jukebox }
          currentTrack={ currentTrack }
          tracklist={ tracklist }
          tracklistImages={ tracklistImages }
          dispatch={ dispatchMock }
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

    it('startPlaying', () => {
      spyOn(actions, 'startPlaying')
      wrapper.instance().startPlaying()
      expect(actions.startPlaying).toHaveBeenCalled()
    })

    it('pausePlaying', () => {
      spyOn(actions, 'pausePlaying')
      wrapper.instance().pausePlaying()
      expect(actions.pausePlaying).toHaveBeenCalled()
    })

    it('skipPlaying', () => {
      spyOn(actions, 'skipPlaying')
      wrapper.instance().skipPlaying()
      expect(actions.skipPlaying).toHaveBeenCalled()
    })

    it('addNewTrack', () => {
      spyOn(actions, 'addNewTrack')
      wrapper.instance().addNewTrack('track')
      expect(actions.addNewTrack).toHaveBeenCalledWith('track')
    })

    it('onVolumeChange', () => {
      spyOn(actions, 'setVolume')
      wrapper.instance().onVolumeChange(32)
      expect(actions.setVolume).toHaveBeenCalledWith(32)
    })

    describe('handleURLDrop', () => {
      it('handles a monitor passed in', () => {
        spyOn(wrapper.instance(), 'addNewTrack')
        const monitor = {
          getItem: () => {
            return { urls: ['url123'] }
          }
        }
        wrapper.instance().handleURLDrop(null, monitor)
        expect(wrapper.instance().addNewTrack).toHaveBeenCalledWith('url123')
      })

      it('handles a monitor not passed in', () => {
        spyOn(wrapper.instance(), 'addNewTrack')
        wrapper.instance().handleURLDrop(null, null)
        expect(wrapper.instance().addNewTrack).not.toHaveBeenCalled()
      })
    })

    describe('onlineIcon', () => {
      it('handles offline', () => {
        expect(wrapper.instance().onlineIcon(false).props.color).toEqual('orange')
      })
    })
  })

  describe('render the connected app', () => {
    const store = configureMockStore()({
      tracklist: [],
      jukebox: {
        currentVolume: 25,
        online: true
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

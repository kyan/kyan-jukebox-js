import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import GoogleAuthContext from 'contexts/google'
import configureMockStore from 'redux-mock-store'
import CurrentTrackContainer from './index'

describe('CurrentTrackContainer', () => {
  let wrapper

  describe('render the connected app', () => {
    const store = configureMockStore()({
      timer: { duration: 10000, position: 8000, remaining: 700 }
    })
    const mockGoogle = {
      googleUser: { googleId: 'duncan123' }
    }

    it('renders something even when no track is available', () => {
      wrapper = mount(
        <Provider store={store}>
          <GoogleAuthContext.Provider value={mockGoogle}>
            <CurrentTrackContainer />
          </GoogleAuthContext.Provider>
        </Provider>
      )
      expect(wrapper).toMatchSnapshot()
      wrapper.find('CurrentTrack').prop('onVote')('uri123', 99)
      expect(store.getActions()).toEqual([{
        type: 'actionVote',
        key: 'vote::castVote',
        params: {
          uri: 'uri123',
          vote: 99
        }
      }])
    })
  })
})

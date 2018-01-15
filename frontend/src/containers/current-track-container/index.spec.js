import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import ConnectedCont, { CurrentTrackContainer } from './index'

describe('CurrentTrackContainer', () => {
  let wrapper

  describe('render just the app without redux', () => {
    it('renders as expected', () => {
      wrapper = shallow(
        <CurrentTrackContainer
          track={{ track: 'track' }}
          image={'image'}
          progress={50}
        />
      )

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('render the connected app', () => {
    const store = configureMockStore()({
      timer: { duration: 0, position: 0 }
    })

    it('renders as expected', () => {
      wrapper = mount(
        <Provider store={store}>
          <ConnectedCont />
        </Provider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})

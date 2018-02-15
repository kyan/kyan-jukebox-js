import React from 'react'
import { shallow, mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import SettingsCont, { Settings } from './index'

describe('CurrentTrackContainer', () => {
  let wrapper
  const mockDispatch = jest.fn()

  describe('render just the app without redux', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Settings
          dispatch={mockDispatch}
          settings={{ open: false }}
        />
      )
    })

    it('renders as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('renders the modal', () => {
      wrapper.find('.jb-settings-toggle').simulate('click')
      expect(mockDispatch.mock.calls.length).toEqual(1)
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: 'actionToggleSettings'
      })
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('render the settings modal open', () => {
    const store = configureMockStore()({
      settings: { open: true }
    })

    it('renders as expected', () => {
      wrapper = mount(
        <Provider store={store}>
          <SettingsCont />
        </Provider>
      )

      expect(wrapper).toMatchSnapshot()
    })
  })
})

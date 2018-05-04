import React from 'react'
import { shallow, mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Form } from 'semantic-ui-react'
import SettingsCont, { Settings } from './index'

describe('CurrentTrackContainer', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('just the app without redux', () => {
    describe('when authorised user', () => {
      const settings = {
        token: 'jwttoken',
        username: 'user123',
        open: false,
        user: {
          fullname: 'John Doe',
          username: 'user123',
          emailHash: 'hash123'
        }
      }
      const wrapper = shallow(
        <Settings
          dispatch={mockDispatch}
          settings={settings}
        />
      )

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

    describe('when nonauthorised user', () => {
      const settings = {
        username: '',
        open: false,
        user: {}
      }
      const wrapper = shallow(
        <Settings
          dispatch={mockDispatch}
          settings={settings}
        />
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('when modal is open', () => {
      const settings = {
        open: true
      }
      const wrapper = shallow(
        <Settings
          dispatch={mockDispatch}
          settings={settings}
        />
      )

      it('handles a change in the input', () => {
        wrapper.find(Form.Input).prop('onChange')(null, { value: 'user123' })
        expect(mockDispatch.mock.calls[0][0]).toEqual({
          type: 'actionStoreUserName',
          username: 'user123'
        })
      })

      it('handles not authenticating a user', () => {
        wrapper.find(Form.Input).prop('action').onClick()
        expect(mockDispatch.mock.calls.length).toEqual(0)
      })

      it('handles authenticating a valid user', () => {
        shallow(
          <Settings
            dispatch={mockDispatch}
            settings={{
              username: 'user123',
              open: true
            }}
          />
        ).find(Form.Input).prop('action').onClick()
        expect(mockDispatch.mock.calls[0][0]).toEqual({
          key: 'auth::authenticateUser',
          params: { username: 'user123' },
          type: 'actionSend'
        })
      })
    })
  })

  describe('render the settings modal open', () => {
    const store = configureMockStore()({
      settings: { open: true }
    })
    const wrapper = mount(
      <Provider store={store}>
        <SettingsCont />
      </Provider>
    )

    it('renders as expected', () => {
      expect(wrapper).toMatchSnapshot()
    })
  })
})

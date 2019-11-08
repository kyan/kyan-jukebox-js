import React from 'react'
import { mount } from 'enzyme'
import GoogleAuthContext from '../../contexts/google'
import Settings from './index'

describe('Settinsg', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    describe('when authorised user', () => {
      const signOutMock = jest.fn()
      const mockGoogle = {
        signOut: signOutMock,
        isSignedIn: true,
        googleUser: {
          profileObj: {
            name: 'Fred Spanner',
            imageUrl: 'myImage123'
          }
        }
      }
      const wrapper = mount(
        <GoogleAuthContext.Provider value={mockGoogle}>
          <Settings />
        </GoogleAuthContext.Provider>
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('handles signing out', () => {
        wrapper.find('Image').simulate('click')
        expect(signOutMock).toHaveBeenCalled()
      })
    })

    describe('when nonauthorised user', () => {
      const signInMock = jest.fn()
      const mockGoogle = {
        signIn: signInMock,
        isSignedIn: false,
        googleUser: null
      }
      const wrapper = mount(
        <GoogleAuthContext.Provider value={mockGoogle}>
          <Settings />
        </GoogleAuthContext.Provider>
      )

      it('renders as expected', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('handles signing in', () => {
        wrapper.find('Button').simulate('click')
        expect(signInMock).toHaveBeenCalled()
      })
    })
  })
})

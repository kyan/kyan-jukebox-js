import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import { mount } from 'enzyme'
import GoogleAuthContext from 'contexts/google'
import Settings from './index'

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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

    test('renders as expected', () => {
      const { asFragment } = render(
        <GoogleAuthContext.Provider value={mockGoogle}>
          <Settings />
        </GoogleAuthContext.Provider>
      )

      const snapshot = asFragment()
      expect(snapshot).toMatchSnapshot()
    })

    test('handles signing out', () => {
      const user = userEvent.setup()
      const { getByTitle } = render(
        <GoogleAuthContext.Provider value={mockGoogle}>
          <Settings />
        </GoogleAuthContext.Provider>
      )

      user.click(getByTitle('Fred Spanner'))
      expect(signOutMock).toHaveBeenCalled()
    })
  })

  describe('when nonauthorised user', () => {
    const signInMock = jest.fn()
    const mockGoogle = {
      grantOfflineAccess: signInMock,
      isSignedIn: false,
      googleUser: null
    }

    const user = userEvent.setup()
    const { getByText, asFragment } = render(
      <GoogleAuthContext.Provider value={mockGoogle}>
        <Settings />
      </GoogleAuthContext.Provider>
    )

    test('renders as expected', () => {
      const snapshot = asFragment()
      expect(snapshot).toMatchSnapshot()
    })

    test('handles signing in', () => {
      user.click(getByText('Login using Google'))
      expect(signInMock).toHaveBeenCalled()
    })
  })
})

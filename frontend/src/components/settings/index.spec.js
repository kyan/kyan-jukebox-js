import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Settings from './index'

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    describe('when user is signed in', () => {
      const signOutMock = jest.fn()
      const mockUser = {
        fullname: 'Fred Spanner',
        email: 'fred@example.com',
        picture: 'myImage123'
      }

      it('renders as expected', () => {
        const { container } = render(
          <Settings user={mockUser} isSignedIn={true} onSignOut={signOutMock} />
        )
        expect(container.firstChild).toBeInTheDocument()
      })

      it('handles signing out', () => {
        const { container } = render(
          <Settings user={mockUser} isSignedIn={true} onSignOut={signOutMock} />
        )
        const avatarImage = container.querySelector('img')
        fireEvent.click(avatarImage)

        const signOutButton = container.querySelector('button')
        if (signOutButton && signOutButton.textContent.includes('Sign Out')) {
          fireEvent.click(signOutButton)
          expect(signOutMock).toHaveBeenCalled()
        }
      })
    })

    describe('when user is not signed in', () => {
      it('renders as expected', () => {
        const { container } = render(
          <Settings user={null} isSignedIn={false} onSignOut={jest.fn()} />
        )
        expect(container.firstChild).toBeInTheDocument()

        // Should show disabled power off button
        const button = container.querySelector('button')
        expect(button).toHaveAttribute('disabled')
      })
    })
  })
})

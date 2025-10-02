import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ClearPlaylist from './index'

describe('ClearPlaylist', () => {
  const onClearMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    it('renders the clear button', () => {
      render(<ClearPlaylist onClear={onClearMock} />)
      expect(screen.getByText('CLEAR')).toBeInTheDocument()
    })

    describe('confirm dialog', () => {
      it('is not shown by default', () => {
        render(<ClearPlaylist onClear={onClearMock} />)
        expect(
          screen.queryByText('Are you sure you want to nuke the playlist?')
        ).not.toBeInTheDocument()
      })

      it('shows when the button is pressed', () => {
        render(<ClearPlaylist onClear={onClearMock} />)
        fireEvent.click(screen.getByText('CLEAR'))
        expect(screen.getByText('Are you sure you want to nuke the playlist?')).toBeInTheDocument()
      })
    })

    describe('callbacks', () => {
      it('calls the onConfirm callback', () => {
        render(<ClearPlaylist onClear={onClearMock} />)
        fireEvent.click(screen.getByText('CLEAR'))
        expect(screen.getByText('Are you sure you want to nuke the playlist?')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Do it!'))
        expect(onClearMock).toHaveBeenCalled()
      })

      it('hides dialog on cancel', () => {
        render(<ClearPlaylist onClear={onClearMock} />)
        fireEvent.click(screen.getByText('CLEAR'))
        expect(screen.getByText('Are you sure you want to nuke the playlist?')).toBeInTheDocument()
        fireEvent.click(screen.getByText('No thanks'))
        expect(
          screen.queryByText('Are you sure you want to nuke the playlist?')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('when disabled', () => {
    it('does not render anything', () => {
      const { container } = render(<ClearPlaylist onClear={onClearMock} disabled />)
      expect(container.firstChild).toBeNull()
    })
  })
})

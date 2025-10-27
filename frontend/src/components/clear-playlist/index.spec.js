import { describe, it, expect, mock } from 'bun:test'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ClearPlaylist from './index'

describe('ClearPlaylist', () => {
  const onClearMock = mock(() => {})

  describe('render', () => {
    it('renders the clear button', () => {
      const { getByText } = render(<ClearPlaylist onClear={onClearMock} />)
      expect(getByText('CLEAR')).toBeInTheDocument()
    })

    describe('confirm dialog', () => {
      it('is not shown by default', () => {
        const { queryByText } = render(<ClearPlaylist onClear={onClearMock} />)
        expect(
          queryByText(
            'Are you sure you want to clear the entire playlist? This action cannot be undone.'
          )
        ).not.toBeInTheDocument()
      })

      it('shows when the button is pressed', () => {
        const { getByText } = render(<ClearPlaylist onClear={onClearMock} />)
        fireEvent.click(getByText('CLEAR'))
        expect(
          getByText(
            'Are you sure you want to clear the entire playlist? This action cannot be undone.'
          )
        ).toBeInTheDocument()
      })
    })

    describe('callbacks', () => {
      it('calls the onConfirm callback', () => {
        const { getByText, getAllByText } = render(<ClearPlaylist onClear={onClearMock} />)
        fireEvent.click(getByText('CLEAR'))
        expect(
          getByText(
            'Are you sure you want to clear the entire playlist? This action cannot be undone.'
          )
        ).toBeInTheDocument()
        // Get the button (second occurrence of "Clear Playlist")
        const buttons = getAllByText('Clear Playlist')
        fireEvent.click(buttons[1])
        expect(onClearMock).toHaveBeenCalled()
      })

      it('hides dialog on cancel', () => {
        const { getByText, queryByText } = render(<ClearPlaylist onClear={onClearMock} />)
        fireEvent.click(getByText('CLEAR'))
        expect(
          getByText(
            'Are you sure you want to clear the entire playlist? This action cannot be undone.'
          )
        ).toBeInTheDocument()
        fireEvent.click(getByText('Cancel'))
        expect(
          queryByText(
            'Are you sure you want to clear the entire playlist? This action cannot be undone.'
          )
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

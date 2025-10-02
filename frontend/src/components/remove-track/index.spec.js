import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RemoveTrack from './index'

describe('RemoveTrack', () => {
  const onClickMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('render', () => {
    beforeEach(() => {
      render(<RemoveTrack uri='uri123' name='The track title' onClick={onClickMock} />)
    })

    it('renders the as expected', () => {
      expect(screen.getByText('Remove')).toBeInTheDocument()
    })

    describe('confirm dialog', () => {
      it('is not shown by default', () => {
        expect(screen.queryByText('Are you sure you want to remove')).not.toBeInTheDocument()
      })

      it('shows when the button is pressed', () => {
        fireEvent.click(screen.getByText('Remove'))
        expect(
          screen.getByText('Are you sure you want to remove: The track title')
        ).toBeInTheDocument()
      })
    })

    describe('callbacks', () => {
      it('calls the onConfirm callback', () => {
        fireEvent.click(screen.getByText('Remove'))
        fireEvent.click(screen.getByText('Do it!'))
        expect(onClickMock).toHaveBeenCalled()
      })

      it('calls the onCancel callback', () => {
        fireEvent.click(screen.getByText('Remove'))
        fireEvent.click(screen.getByText('No thanks'))
        expect(
          screen.queryByText('Are you sure you want to remove: The track title')
        ).not.toBeInTheDocument()
      })
    })
  })
})

import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import RemoveTrack from './index'

describe('RemoveTrack', () => {
  const onClickMock = mock(() => {})

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render', () => {
    let renderResult

    beforeEach(() => {
      renderResult = render(
        <RemoveTrack uri='uri123' name='The track title' onClick={onClickMock} />
      )
    })

    it('renders the as expected', () => {
      expect(renderResult.getByText('Remove')).toBeInTheDocument()
    })

    describe('confirm dialog', () => {
      it('is not shown by default', () => {
        expect(renderResult.queryByText('Are you sure you want to remove')).not.toBeInTheDocument()
      })

      it('shows when the button is pressed', () => {
        fireEvent.click(renderResult.getByText('Remove'))
        expect(
          renderResult.getByText('Are you sure you want to remove: The track title')
        ).toBeInTheDocument()
      })
    })

    describe('callbacks', () => {
      beforeEach(() => {
        fireEvent.click(renderResult.getByText('Remove'))
      })

      it('calls the onConfirm callback', () => {
        fireEvent.click(renderResult.getByText('Do it!'))
        expect(onClickMock).toHaveBeenCalled()
      })

      it('calls the onCancel callback', () => {
        fireEvent.click(renderResult.getByText('Remove'))
        fireEvent.click(renderResult.getByText('No thanks'))
        expect(
          renderResult.queryByText('Are you sure you want to remove: The track title')
        ).not.toBeInTheDocument()
      })
    })
  })
})

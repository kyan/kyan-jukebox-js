import { describe, it, expect, mock } from 'bun:test'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render, fireEvent } from '@testing-library/react'
import VolumeButtons from './index'

describe('VolumeButtons', () => {
  const mockStore = configureMockStore()

  it('renders as expected', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    expect(container.firstChild).toBeInTheDocument()

    // Check that volume buttons are present
    const volumeDownButton = container.querySelector('.jb-volume-down')
    const volumeUpButton = container.querySelector('.jb-volume-up')

    expect(volumeDownButton).toBeInTheDocument()
    expect(volumeUpButton).toBeInTheDocument()
  })

  it('renders with disabled state', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons disabled={true} onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    expect(container.firstChild).toBeInTheDocument()

    // Check that buttons are disabled
    const volumeDownButton = container.querySelector('.jb-volume-down')
    const volumeUpButton = container.querySelector('.jb-volume-up')

    expect(volumeDownButton).toBeDisabled()
    expect(volumeUpButton).toBeDisabled()
  })

  it('displays current volume', () => {
    const store = mockStore({
      jukebox: { volume: 75 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    // Check that the volume is displayed in data-text attribute
    const volumeDisplay = container.querySelector('[data-text="75"]')
    expect(volumeDisplay).toBeInTheDocument()
  })

  it('calls onVolumeChange when volume up button is clicked', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    const volumeUpButton = container.querySelector('.jb-volume-up')
    fireEvent.click(volumeUpButton)

    expect(mockOnVolumeChange).toHaveBeenCalledWith(55)
  })

  it('calls onVolumeChange when volume down button is clicked', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    const volumeDownButton = container.querySelector('.jb-volume-down')
    fireEvent.click(volumeDownButton)

    expect(mockOnVolumeChange).toHaveBeenCalledWith(45)
  })

  it('does not call onVolumeChange when disabled', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons disabled={true} onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    const volumeUpButton = container.querySelector('.jb-volume-up')
    const volumeDownButton = container.querySelector('.jb-volume-down')

    fireEvent.click(volumeUpButton)
    fireEvent.click(volumeDownButton)

    expect(mockOnVolumeChange).not.toHaveBeenCalled()
  })
})

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

    const { container, getByText } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    expect(container.firstChild).toBeInTheDocument()

    // Check that volume buttons are present
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(2)

    // Check that volume display is present
    expect(getByText('50')).toBeInTheDocument()
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
    const buttons = container.querySelectorAll('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })

  it('displays current volume', () => {
    const store = mockStore({
      jukebox: { volume: 75 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { getByText } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    // Check that the volume is displayed
    expect(getByText('75')).toBeInTheDocument()
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

    // Volume up button is the second button
    const volumeUpButton = container.querySelectorAll('button')[1]
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

    // Volume down button is the first button
    const volumeDownButton = container.querySelectorAll('button')[0]
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

    const buttons = container.querySelectorAll('button')
    const volumeDownButton = buttons[0]
    const volumeUpButton = buttons[1]

    fireEvent.click(volumeUpButton)
    fireEvent.click(volumeDownButton)

    expect(mockOnVolumeChange).not.toHaveBeenCalled()
  })

  it('disables volume down button at minimum volume', () => {
    const store = mockStore({
      jukebox: { volume: 0 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    const volumeDownButton = container.querySelectorAll('button')[0]
    expect(volumeDownButton).toBeDisabled()
  })

  it('disables volume up button at maximum volume', () => {
    const store = mockStore({
      jukebox: { volume: 100 }
    })

    const mockOnVolumeChange = mock(() => {})

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    const volumeUpButton = container.querySelectorAll('button')[1]
    expect(volumeUpButton).toBeDisabled()
  })
})

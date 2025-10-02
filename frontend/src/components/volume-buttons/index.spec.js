import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render } from '@testing-library/react'
import VolumeButtons from './index'

describe('VolumeButtons', () => {
  const mockStore = configureMockStore()

  it('renders as expected', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = jest.fn()

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with disabled state', () => {
    const store = mockStore({
      jukebox: { volume: 50 }
    })

    const mockOnVolumeChange = jest.fn()

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons disabled={true} onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    expect(container.firstChild).toBeInTheDocument()
    // Check that buttons are disabled
    const buttons = container.querySelectorAll('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('displays current volume', () => {
    const store = mockStore({
      jukebox: { volume: 75 }
    })

    const mockOnVolumeChange = jest.fn()

    const { container } = render(
      <Provider store={store}>
        <VolumeButtons onVolumeChange={mockOnVolumeChange} />
      </Provider>
    )

    const volumeDisplay = container.querySelector('[data-text="75"]')
    expect(volumeDisplay).toBeInTheDocument()
  })
})

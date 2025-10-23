import { describe, it, expect, beforeEach, mock } from 'bun:test'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { render } from '@testing-library/react'
import ProgressBar from './index'

describe('ProgressBar', () => {
  const prevMock = mock(() => {})
  const nextMock = mock(() => {})
  const mockStore = configureMockStore()

  beforeEach(() => {
    // Bun mocks are cleared automatically between tests
  })

  describe('render', () => {
    it('renders the as expected', () => {
      const store = mockStore({
        timer: { duration: 10000, position: 8000, remaining: 700 },
        track: { length: 12345 }
      })
      const { container } = render(
        <Provider store={store}>
          <ProgressBar onPrevious={prevMock} onNext={nextMock} />
        </Provider>
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})

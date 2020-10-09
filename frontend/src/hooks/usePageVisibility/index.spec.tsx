import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import usePageVisibility from './index'

interface VisDoc extends Document {
  msHidden: any
  webkitHidden: any
  msvisibilitychange: any
  webkitvisibilitychange: any
}

test('should handle default', async () => {
  function TestComponent() {
    const isVisible = usePageVisibility()

    return isVisible ? <span>lookatme</span> : null
  }

  render(<TestComponent />)
  const lookatme = screen.queryByText('lookatme')
  expect(lookatme).not.toBeNull()
})

test('should handle ms', async () => {
  ;(document as VisDoc).msHidden = true
  ;(document as VisDoc).msvisibilitychange = true

  function TestComponent() {
    const isVisible = usePageVisibility()

    return isVisible ? <span>lookatme</span> : null
  }

  render(<TestComponent />)
  const lookatme = screen.queryByText('lookatme')
  expect(lookatme).toBeNull()
})

test('should handle webkit', async () => {
  ;(document as VisDoc).msHidden = undefined
  ;(document as VisDoc).msvisibilitychange = undefined
  ;(document as VisDoc).webkitHidden = true
  ;(document as VisDoc).webkitvisibilitychange = true

  function TestComponent() {
    const isVisible = usePageVisibility()

    return isVisible ? <span>lookatme</span> : null
  }

  render(<TestComponent />)
  const lookatme = screen.queryByText('lookatme')
  expect(lookatme).toBeNull()
})

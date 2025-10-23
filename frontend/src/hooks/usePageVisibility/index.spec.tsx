import { it, expect } from 'bun:test'
import React from 'react'
import { render } from '@testing-library/react'
import usePageVisibility from './index'

interface VisDoc extends Document {
  msHidden: any
  webkitHidden: any
  msvisibilitychange: any
  webkitvisibilitychange: any
}

it('should handle default', async () => {
  function TestComponent() {
    const isVisible = usePageVisibility()

    return isVisible ? <span>lookatme</span> : null
  }

  const { queryByText } = render(<TestComponent />)
  const lookatme = queryByText('lookatme')
  expect(lookatme).not.toBeNull()
})

it('should handle ms', async () => {
  ;(document as VisDoc).msHidden = true
  ;(document as VisDoc).msvisibilitychange = true

  function TestComponent() {
    const isVisible = usePageVisibility()

    return isVisible ? <span>lookatme</span> : null
  }

  const { queryByText } = render(<TestComponent />)
  const lookatme = queryByText('lookatme')
  expect(lookatme).toBeNull()
})

it('should handle webkit', async () => {
  ;(document as VisDoc).msHidden = undefined
  ;(document as VisDoc).msvisibilitychange = undefined
  ;(document as VisDoc).webkitHidden = true
  ;(document as VisDoc).webkitvisibilitychange = true

  function TestComponent() {
    const isVisible = usePageVisibility()

    return isVisible ? <span>lookatme</span> : null
  }

  const { queryByText } = render(<TestComponent />)
  const lookatme = queryByText('lookatme')
  expect(lookatme).toBeNull()
})

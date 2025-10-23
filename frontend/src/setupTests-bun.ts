// @ts-nocheck
import { afterEach } from 'bun:test'
import { cleanup } from '@testing-library/react'

// Import jest-dom for side effects - this automatically extends global expect
import '@testing-library/jest-dom'

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup()
})

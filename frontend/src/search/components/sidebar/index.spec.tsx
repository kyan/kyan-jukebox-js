import { describe, it, expect } from 'bun:test'
import Search from './index'

describe('Search', () => {
  // Add a simple test to ensure the module can be imported
  describe('module import', () => {
    it('can import the Search component without hanging', () => {
      expect(Search).toBeDefined()
      expect(typeof Search).toBe('function')
    })
  })
})

import ErrorHandler from '../../src/handlers/errors'
import { expect, test, describe } from 'bun:test'

describe('ErrorHandler', () => {
  describe('expectationThatThrows', () => {
    test('throws with a message if the expectation is not met', () => {
      expect(() => {
        ErrorHandler.expectationThatThrows({
          expect: [].length === 6,
          message: 'Well that went wrong'
        })
      }).toThrow('Well that went wrong')
    })

    test('does not throw if the expectation is met', () => {
      expect(() => {
        ErrorHandler.expectationThatThrows({
          expect: 'one'.length === 3,
          message: 'Phew, everything worked'
        })
      }).not.toThrow()
    })
  })
})

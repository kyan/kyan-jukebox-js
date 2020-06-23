import ErrorHandler from '../../src/handlers/errors'

describe('ErrorHandler', () => {
  describe('expectationThatThrows', () => {
    it('throws with a message if the expectation is not met', () => {
      expect(() => {
        ErrorHandler.expectationThatThrows({
          expect: false === true,
          message: 'Well that went wrong'
        })
      }).toThrow('Well that went wrong')
    })

    it('does not throw if the expectation is met', () => {
      expect(() => {
        ErrorHandler.expectationThatThrows({
          expect: 'one'.length === 3,
          message: 'Phew, everything worked'
        })
      }).not.toThrow()
    })
  })
})

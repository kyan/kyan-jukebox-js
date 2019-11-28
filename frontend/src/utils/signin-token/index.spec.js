import * as workerTimers from 'worker-timers'
import SignInToken from './index'

jest.mock('worker-timers', () => {
  return {
    setTimeout: jest.fn((func, _) => {
      func()
      return 'newtoken'
    }),
    clearTimeout: jest.fn()
  }
})

describe('SignInToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('.refresh', () => {
    it('returns a token', done => {
      expect.assertions(2)
      const mockGoogle = {
        reloadAuthResponse: jest.fn()
          .mockImplementation(() => Promise.resolve({ id_token: 'new_token' }))
      }
      const mockSuccess = jest.fn()
      spyOn(console, 'warn')

      SignInToken.refresh(mockGoogle, mockSuccess)

      setTimeout(() => {
        try {
          expect(mockSuccess).toHaveBeenCalledWith('new_token')
          expect(console.warn).not.toHaveBeenCalled()
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })

    it('errors to the console', done => {
      expect.assertions(2)
      const mockGoogle = {
        reloadAuthResponse: jest.fn()
          .mockImplementation(() => Promise.reject(new Error('bang')))
      }
      const mockSuccess = jest.fn()
      spyOn(console, 'warn')

      SignInToken.refresh(mockGoogle, mockSuccess)

      setTimeout(() => {
        try {
          expect(console.warn).toHaveBeenCalledWith('Token un-refreshable: ', 'bang')
          expect(mockSuccess).not.toHaveBeenCalled()
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })

  describe('.clear', () => {
    it('clears a token when passed an ID', () => {
      SignInToken.clear(123)
      expect(workerTimers.clearTimeout).toHaveBeenCalledWith(123)
    })

    it('does not clear a token when passed no ID', () => {
      SignInToken.clear()
      expect(workerTimers.clearTimeout).not.toHaveBeenCalled()
    })
  })
})

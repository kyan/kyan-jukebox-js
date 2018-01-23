import MessageTriage from './index'
import MopidyHandler from '../handlers/mopidy'
jest.mock('../handlers/mopidy')

describe('MessageTriage', () => {
  const mopidy = jest.fn()
  const cb = jest.fn()
  const ws = jest.fn()
  const broadcaster = jest.fn()

  describe('when votes', () => {
    let payload = '{"key":"votes::playback.play","data":{}}'

    it('it should currently error', () => {
      expect(function () {
        MessageTriage(payload, mopidy, cb)
      }).toThrow()
    })
  })

  describe('when mopidy', () => {
    let payload = '{"key":"mopidy::playback.play","data":{}}'

    it('it should default to Mopidy', () => {
      MessageTriage(payload, mopidy, cb)
      cb.mock.calls[0][0](ws, broadcaster)
      expect(MopidyHandler).toHaveBeenCalledWith(
        payload, ws, broadcaster, mopidy
      )
    })
  })
})

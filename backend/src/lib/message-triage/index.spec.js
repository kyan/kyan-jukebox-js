import MessageTriage from './index'
import MopidyHandler from '../handlers/mopidy'
jest.mock('../handlers/mopidy')

describe('MessageTriage', () => {
  const mopidy = jest.fn()
  const cb = jest.fn()
  const ws = jest.fn()
  const broadcaster = jest.fn()

  beforeEach(() => {
    spyOn(console, 'log')
  })

  describe('when mopidy service', () => {
    let payload = '{"key":"mopidy::playback.play","data":{}}'

    it('it should default to Mopidy', () => {
      MessageTriage(payload, mopidy, cb)
      cb.mock.calls[0][0](ws, broadcaster)
      expect(MopidyHandler).toHaveBeenCalledWith(
        payload, ws, broadcaster, mopidy
      )
    })
  })

  describe('when unknown service', () => {
    let payload = '{"key":"unknownfoo::playback.play","data":{}}'

    it('it should currently error', () => {
      MessageTriage(payload, mopidy, cb)
      expect(console.log).toBeCalledWith('UNKNOWN MESSAGE SERVICE: ', 'unknownfoo')
    })
  })
})

import logger from 'config/winston'
import MessageTriage from './index'
import AuthenticateHandler from '../handlers/authenticate'
import MopidyHandler from '../handlers/mopidy'
jest.mock('../handlers/authenticate')
jest.mock('../handlers/mopidy')
jest.mock('config/winston')

describe('MessageTriage', () => {
  const mopidy = jest.fn()
  const cb = jest.fn()
  const ws = jest.fn()
  const broadcaster = jest.fn()

  describe('when mopidy service', () => {
    const payload = { service: 'mopidy' }

    it('it should return mopidy handler', () => {
      MessageTriage(payload, mopidy, cb)
      cb.mock.calls[0][0](ws, broadcaster)
      expect(AuthenticateHandler.mock.calls[0][0]).toEqual(payload)
      expect(AuthenticateHandler.mock.calls[0][1]).toEqual(ws)
      expect(AuthenticateHandler.mock.calls[0][2]).toEqual(broadcaster)
      AuthenticateHandler.mock.calls[0][3]('updatedPayload')
      expect(MopidyHandler.mock.calls[0][0]).toEqual('updatedPayload')
      expect(MopidyHandler.mock.calls[0][1]).toEqual(ws)
      expect(MopidyHandler.mock.calls[0][2]).toEqual(broadcaster)
      expect(MopidyHandler.mock.calls[0][3]).toEqual(mopidy)
    })
  })

  describe('when unknown service', () => {
    const payload = { service: 'unknownfoo' }

    it('it should just log the fact', () => {
      MessageTriage(payload, mopidy, cb)
      expect(logger.warn.mock.calls[0][0])
        .toEqual("Can't find handler for: unknownfoo")
    })
  })
})

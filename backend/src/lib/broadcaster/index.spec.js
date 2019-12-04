import broadcaster from './index'
import logger from 'config/winston'
import EventLogger from '../../lib/event-logger'
jest.mock('config/winston')
jest.mock('../../lib/event-logger')

describe('Broadcaster', () => {
  afterEach(() => {
    EventLogger.mockClear()
  })

  describe('#to', () => {
    it('handles unauthorised call', () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('message')
      expect(sendMock.mock.calls[0][1])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
      expect(EventLogger.mock.calls[0][0]).toEqual({ encoded_key: 'mopidy::playback.next' })
      expect(EventLogger.mock.calls[0][1]).toBeNull()
      expect(EventLogger.mock.calls[0][2]).toEqual('hello mum')
      expect(EventLogger.mock.calls[0][3]).toEqual('PublicBroadcast')
    })

    it('handles authorised call', () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        user: { _id: '123' },
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('message')
      expect(sendMock.mock.calls[0][1])
        .toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
      expect(EventLogger.mock.calls[0][0]).toEqual({
        encoded_key: 'mopidy::playback.next',
        user: { _id: '123' }
      })
      expect(EventLogger.mock.calls[0][1]).toBeNull()
      expect(EventLogger.mock.calls[0][2]).toEqual('hello mum')
      expect(EventLogger.mock.calls[0][3]).toEqual('UserBroadcast')
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        user: { _id: '123' },
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      broadcaster.to(clientMock, payload, message)
      expect(logger.error.mock.calls[0][0]).toEqual('Broadcast_to#')
      expect(logger.error.mock.calls[0][1]).toEqual({ message: 'oops' })
    })
  })
})

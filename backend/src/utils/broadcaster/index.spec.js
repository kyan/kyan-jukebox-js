import broadcaster from './index'
import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
import Transform from 'utils/transformer'
jest.mock('config/winston')
jest.mock('utils/event-logger')
jest.mock('utils/transformer', () => {
  return {
    message: jest.fn().mockImplementation((_, message) => Promise.resolve(message))
  }
})
describe('Broadcaster', () => {
  afterEach(() => {
    EventLogger.mockClear()
  })

  describe('#to', () => {
    it('handles unauthorised call', async () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        encoded_key: 'mopidy::playback.next'
      }
      const message = 'hello mum'

      await broadcaster.to(clientMock, payload, message)
      expect(Transform.message).toHaveBeenCalledWith(
        { encoded_key: 'mopidy::playback.next' },
        'hello mum'
      )
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"mopidy::playback.next","data":"hello mum"}'
      )
      expect(EventLogger).toHaveBeenCalledWith(
        { encoded_key: 'mopidy::playback.next' },
        null,
        '{"key":"mopidy::playback.next","data":"hello mum"}',
        'OUTGOING API'
      )
    })

    it('handles authorised call', async () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        encoded_key: 'mopidy::playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      await broadcaster.to(clientMock, payload, message)
      expect(Transform.message).toHaveBeenCalledWith(
        { encoded_key: 'mopidy::playback.next', user: 'duncan' },
        'hello mum'
      )
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"mopidy::playback.next","data":"hello mum","user":"duncan"}'
      )
      expect(EventLogger).toHaveBeenCalledWith(
        { encoded_key: 'mopidy::playback.next', user: 'duncan' },
        null,
        '{"key":"mopidy::playback.next","data":"hello mum","user":"duncan"}',
        'OUTGOING API [AUTHED]'
      )
    })

    it('handles error', async () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        encoded_key: 'mopidy::playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      await broadcaster.to(clientMock, payload, message)
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#to', { message: 'oops' })
    })
  })

  describe('#toAllGeneric', () => {
    it('handles call', () => {
      const sendMock = jest.fn()
      const socketMock = {
        emit: sendMock
      }
      const key = 'mopidy::playback.next'
      const message = 'hello mum'

      broadcaster.toAllGeneric(socketMock, key, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('message')
      expect(sendMock.mock.calls[0][1]).toEqual('{"key":"mopidy::playback.next","data":"hello mum"}')
      expect(EventLogger.mock.calls[0][0]).toEqual('mopidy::playback.next')
      expect(EventLogger.mock.calls[0][1]).toBeNull()
      expect(EventLogger.mock.calls[0][2]).toEqual('hello mum')
      expect(EventLogger.mock.calls[0][3]).toEqual('OUTGOING API BROADCAST')
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socketMock = {
        emit: sendMock
      }
      const key = 'mopidy::playback.next'
      const message = 'hello mum'

      broadcaster.toAllGeneric(socketMock, key, message)
      expect(sendMock.mock.calls[0]).toEqual(['message', '{"key":"mopidy::playback.next","data":"hello mum"}'])
      expect(logger.error.mock.calls[0][0]).toEqual('Broadcaster#toAll')
      expect(logger.error.mock.calls[0][1]).toEqual({ message: 'oops' })
    })
  })

  describe('#toAllMopidy', () => {
    it('handles call', () => {
      const sendMock = jest.fn()
      const socketMock = {
        emit: sendMock
      }
      const message = { online: false }

      broadcaster.toAllMopidy(socketMock, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('mopidy')
      expect(sendMock.mock.calls[0][1]).toEqual('{"online":false}')
      expect(EventLogger.mock.calls[0][0]).toEqual({ encoded_key: 'state' })
      expect(EventLogger.mock.calls[0][1]).toBeNull()
      expect(EventLogger.mock.calls[0][3]).toEqual('OUTGOING API BROADCAST')
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socketMock = {
        emit: sendMock
      }
      const message = { online: false }

      broadcaster.toAllMopidy(socketMock, message)
      expect(sendMock.mock.calls[0]).toEqual(['mopidy', '{"online":false}'])
      expect(logger.error.mock.calls[0][0]).toEqual('Broadcaster#toAll')
      expect(logger.error.mock.calls[0][1]).toEqual({ message: 'oops' })
    })
  })
})

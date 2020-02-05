import broadcaster from './index'
import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
jest.mock('config/winston')
jest.mock('utils/event-logger')

describe('Broadcaster', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('#to', () => {
    it('handles unauthorised call', async () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = { key: 'playback.next' }
      const message = 'hello mum'

      await broadcaster.toClient(clientMock, payload, message)
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING API',
        { data: 'hello mum', key: 'playback.next' }
      )
    })

    it('handles authorised call', async () => {
      const sendMock = jest.fn()
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      await broadcaster.toClient(clientMock, payload, message)
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum","user":"duncan"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING API [AUTHED]',
        { data: 'hello mum', key: 'playback.next' }
      )
    })

    it('handles error', async () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const clientMock = {
        id: '12345',
        emit: sendMock
      }
      const payload = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      await broadcaster.toClient(clientMock, payload, message)
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#toClient', { message: 'oops' })
    })
  })

  describe('#toAll', () => {
    it('handles call', () => {
      const sendMock = jest.fn()
      const socketMock = {
        emit: sendMock
      }
      const key = 'playback.next'
      const message = 'hello mum'

      broadcaster.toAll(socketMock, key, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('message')
      expect(sendMock.mock.calls[0][1]).toEqual('{"key":"playback.next","data":"hello mum"}')

      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING API BROADCAST',
        { data: 'hello mum', key: 'playback.next' }
      )
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socketMock = {
        emit: sendMock
      }
      const key = 'playback.next'
      const message = 'hello mum'

      broadcaster.toAll(socketMock, key, message)
      expect(sendMock.mock.calls[0]).toEqual(['message', '{"key":"playback.next","data":"hello mum"}'])
      expect(logger.error.mock.calls[0][0]).toEqual('Broadcaster#toAll')
      expect(logger.error.mock.calls[0][1]).toEqual({ message: 'oops' })
    })
  })

  describe('#stateChange', () => {
    it('handles call', () => {
      const sendMock = jest.fn()
      const socketMock = {
        emit: sendMock
      }
      const message = { online: false }

      broadcaster.stateChange(socketMock, message)
      expect(sendMock.mock.calls.length).toEqual(1)
      expect(sendMock.mock.calls[0][0]).toEqual('mopidy')
      expect(sendMock.mock.calls[0][1]).toEqual('{"online":false}')
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING STATE CHANGE',
        { data: { online: false }, key: 'state' }
      )
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socketMock = {
        emit: sendMock
      }
      const message = { online: false }

      broadcaster.stateChange(socketMock, message)
      expect(sendMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(logger.error.mock.calls[0][0]).toEqual('Broadcaster#toAllMopidy')
      expect(logger.error.mock.calls[0][1]).toEqual({ message: 'oops' })
    })
  })
})

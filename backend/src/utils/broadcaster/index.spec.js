import broadcaster from './index'
import logger from 'config/winston'
import EventLogger from 'utils/event-logger'
jest.mock('config/winston')
jest.mock('utils/event-logger')

describe('Broadcaster', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('#toClient', () => {
    it('handles unauthorised call', () => {
      const sendMock = jest.fn()
      const socket = {
        id: '12345',
        emit: sendMock
      }
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      broadcaster.toClient({ socket, headers, message })
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING API',
        { data: 'hello mum', key: 'playback.next' }
      )
    })

    it('handles authorised call', () => {
      const sendMock = jest.fn()
      const socket = {
        id: '12345',
        emit: sendMock
      }
      const headers = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      broadcaster.toClient({ socket, headers, message })
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum","user":"duncan"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING API [AUTHED]',
        { data: 'hello mum', key: 'playback.next' }
      )
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socket = {
        id: '12345',
        emit: sendMock
      }
      const headers = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      broadcaster.toClient({ socket, headers, message })
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#toClient', { message: 'oops' })
    })
  })

  describe('#toAll', () => {
    it('handles call', () => {
      const sendMock = jest.fn()
      const socketio = {
        emit: sendMock
      }
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      broadcaster.toAll({ socketio, headers, message })
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING BROADCAST',
        { data: 'hello mum', key: 'playback.next' }
      )
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socketio = {
        emit: sendMock
      }
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      broadcaster.toAll({ socketio, headers, message })
      expect(sendMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(logger.error).toHaveBeenCalledWith(
        'Broadcaster#toAll',
        { message: 'oops' }
      )
    })
  })

  describe('#stateChange', () => {
    it('handles call', () => {
      const sendMock = jest.fn()
      const socket = {
        emit: sendMock
      }
      const message = { online: false }

      broadcaster.stateChange({ socket, message })
      expect(sendMock).toHaveBeenCalledWith(
        'mopidy',
        '{"online":false}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith(
        'OUTGOING STATE CHANGE',
        { data: { online: false }, key: 'state' }
      )
    })

    it('handles error', () => {
      const sendMock = jest.fn(() => { throw Error('oops') })
      const socket = {
        emit: sendMock
      }
      const message = { online: false }

      broadcaster.stateChange({ socket, message })
      expect(sendMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(logger.error).toHaveBeenCalledWith(
        'Broadcaster#stateChange',
        { message: 'oops' }
      )
    })
  })
})

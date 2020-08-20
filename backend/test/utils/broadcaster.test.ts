import broadcaster from '../../src/utils/broadcaster'
import logger from '../../src/config/logger'
import EventLogger from '../../src/utils/event-logger'
jest.mock('../../src/config/logger')
jest.mock('../../src/utils/event-logger')

describe('Broadcaster', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('#toClient', () => {
    it('handles unauthorised call', () => {
      const emitMock = jest.fn()
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      const socket = { id: '123', emit: emitMock } as any
      const mockSocket = socket as SocketIO.Socket

      broadcaster.toClient({ socket: mockSocket, headers, message })

      expect(socket.emit).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith('OUTGOING API', {
        data: 'hello mum',
        key: 'playback.next'
      })
    })

    it('handles authorised call', () => {
      const emitMock = jest.fn()
      const headers = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      const socket = { id: '123', emit: emitMock } as any
      const mockSocket = socket as SocketIO.Socket

      broadcaster.toClient({ socket: mockSocket, headers, message })
      expect(emitMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum","user":"duncan"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith('OUTGOING API [AUTHED]', {
        data: 'hello mum',
        key: 'playback.next'
      })
    })

    it('handles error', () => {
      const emitMock = jest.fn(() => {
        throw Error('oops')
      })
      const headers = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      const socket = { id: '123', emit: emitMock } as any
      const mockSocket = socket as SocketIO.Socket

      broadcaster.toClient({ socket: mockSocket, headers, message })
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#toClient', {
        message: 'oops'
      })
    })
  })

  describe('#toAll', () => {
    it('handles call', () => {
      const emitMock = jest.fn()
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      const socket = { emit: emitMock } as any
      const mockSocket = socket as SocketIO.Server

      broadcaster.toAll({ socketio: mockSocket, headers, message })
      expect(emitMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(EventLogger.info).toHaveBeenCalledWith('OUTGOING BROADCAST', {
        data: 'hello mum',
        key: 'playback.next'
      })
    })

    it('handles error', () => {
      const emitMock = jest.fn(() => {
        throw Error('oops')
      })
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      const socket = { emit: emitMock } as any
      const mockSocket = socket as SocketIO.Server

      broadcaster.toAll({ socketio: mockSocket, headers, message })
      expect(emitMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#toAll', { message: 'oops' })
    })
  })

  describe('#stateChange', () => {
    it('handles call to user', () => {
      const emitMock = jest.fn()
      const message = { online: false }

      const socket = { emit: emitMock } as any
      const mockSocket = socket as SocketIO.Socket

      broadcaster.stateChange({ socket: mockSocket, message })
      expect(emitMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(EventLogger.info).toHaveBeenCalledWith('OUTGOING STATE CHANGE', {
        data: { online: false },
        key: 'state'
      })
    })

    it('handles call to ', () => {
      const emitMock = jest.fn()
      const message = { online: false }

      const socket = { emit: emitMock } as any
      const mockSocket = socket as SocketIO.Server

      broadcaster.stateChange({ socketio: mockSocket, message })
      expect(emitMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(EventLogger.info).toHaveBeenCalledWith('OUTGOING STATE CHANGE', {
        data: { online: false },
        key: 'state'
      })
    })

    it('handles error', () => {
      const emitMock = jest.fn(() => {
        throw Error('oops')
      })
      const message = { online: false }

      const socket = { emit: emitMock } as any
      const mockSocket = socket as SocketIO.Socket

      broadcaster.stateChange({ socket: mockSocket, message })
      expect(emitMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#stateChange', {
        message: 'oops'
      })
    })
  })
})

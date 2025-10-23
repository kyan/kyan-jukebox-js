import { Server, Socket } from 'socket.io'
import Broadcaster from '../../src/utils/broadcaster'
import logger from '../../src/config/logger'
import { expect, test, describe, mock, beforeEach } from 'bun:test'

// Mock logger
const mockLogger = {
  info: mock(() => {}),
  error: mock(() => {}),
  warn: mock(() => {}),
  debug: mock(() => {})
}
mock.module('../../src/config/logger', () => ({ default: mockLogger }))

// Mock EventLogger
const mockEventLogger = {
  info: mock(() => {})
}
mock.module('../../src/utils/event-logger', () => ({ default: mockEventLogger }))

describe('Broadcaster', () => {
  beforeEach(() => {
    mockLogger.info.mockClear()
    mockEventLogger.info.mockClear()
  })

  describe('#toClient', () => {
    test('handles unauthorised call', () => {
      const emitMock = mock()
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      const socket = { id: '123', emit: emitMock } as any
      const mockSocket = socket as Socket

      Broadcaster.toClient({ socket: mockSocket, headers, message })

      expect(socket.emit).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(mockEventLogger.info).toHaveBeenCalledWith('OUTGOING API', {
        data: 'hello mum',
        key: 'playback.next'
      })
    })

    test('handles authorised call', () => {
      const emitMock = mock()
      const headers = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      const socket = { id: '123', emit: emitMock } as any
      const mockSocket = socket as Socket

      Broadcaster.toClient({ socket: mockSocket, headers, message })
      expect(emitMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum","user":"duncan"}'
      )
      expect(mockEventLogger.info).toHaveBeenCalledWith('OUTGOING API [AUTHED]', {
        data: 'hello mum',
        key: 'playback.next'
      })
    })

    test('handles error', () => {
      const emitMock = mock(() => {
        throw Error('oops')
      })
      const headers = {
        key: 'playback.next',
        user: 'duncan'
      }
      const message = 'hello mum'

      const socket = { id: '123', emit: emitMock } as any
      const mockSocket = socket as Socket

      Broadcaster.toClient({ socket: mockSocket, headers, message })
      expect(logger.error).toHaveBeenCalledWith('Broadcaster#toClient', {
        message: 'oops'
      })
    })
  })

  describe('#toAll', () => {
    test('handles call', () => {
      const emitMock = mock()
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      const socket = { emit: emitMock } as any
      const mockSocket = socket as Server

      Broadcaster.toAll({ socketio: mockSocket, headers, message })
      expect(emitMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(mockEventLogger.info).toHaveBeenCalledWith('OUTGOING BROADCAST', {
        data: 'hello mum',
        key: 'playback.next'
      })
    })

    test('handles error', () => {
      const emitMock = mock(() => {
        throw Error('oops')
      })
      const headers = { key: 'playback.next' }
      const message = 'hello mum'

      const socket = { emit: emitMock } as any
      const mockSocket = socket as Server

      Broadcaster.toAll({ socketio: mockSocket, headers, message })
      expect(emitMock).toHaveBeenCalledWith(
        'message',
        '{"key":"playback.next","data":"hello mum"}'
      )
      expect(mockLogger.error).toHaveBeenCalledWith('Broadcaster#toAll', {
        message: 'oops'
      })
    })
  })

  describe('#stateChange', () => {
    test('handles call to user', () => {
      const emitMock = mock()
      const message = { online: false }

      const socket = { emit: emitMock } as any
      const mockSocket = socket as Socket

      Broadcaster.stateChange({ socket: mockSocket, message })
      expect(emitMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(mockEventLogger.info).toHaveBeenCalledWith('OUTGOING STATE CHANGE', {
        data: { online: false },
        key: 'state'
      })
    })

    test('handles call to', () => {
      const emitMock = mock()
      const message = { online: false }

      const socket = { emit: emitMock } as any
      const mockSocket = socket as Server

      Broadcaster.stateChange({ socketio: mockSocket, message })
      expect(emitMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(mockEventLogger.info).toHaveBeenCalledWith('OUTGOING STATE CHANGE', {
        data: { online: false },
        key: 'state'
      })
    })

    test('handles error', () => {
      const emitMock = mock(() => {
        throw Error('oops')
      })
      const message = { online: false }

      const socket = { emit: emitMock } as any
      const mockSocket = socket as Socket

      Broadcaster.stateChange({ socket: mockSocket, message })
      expect(emitMock).toHaveBeenCalledWith('mopidy', '{"online":false}')
      expect(mockLogger.error).toHaveBeenCalledWith('Broadcaster#stateChange', {
        message: 'oops'
      })
    })
  })
})

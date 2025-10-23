import { Server, Socket } from 'socket.io'
import Broadcaster from '../../src/utils/broadcaster'
import Mopidy from 'mopidy'
import MopidyHandler from '../../src/handlers/mopidy'
import { expect, test, describe, mock, beforeEach } from 'bun:test'

// Mock Spotify
const mockSpotifyValidateTrack = mock()
mock.module('../../src/services/spotify', () => ({
  default: {
    validateTrack: mockSpotifyValidateTrack
  }
}))

// Mock MopidyDecorator
const mockDecoratorParse = mock()
const mockDecoratorMopidyCoreMessage = mock()
mock.module('../../src/decorators/mopidy', () => ({
  default: {
    parse: mockDecoratorParse,
    mopidyCoreMessage: mockDecoratorMopidyCoreMessage
  }
}))

// Mock Broadcaster
const mockBroadcaster = {
  toClient: mock(() => {}),
  toAll: mock(() => {}),
  stateChange: mock(() => {})
}
mock.module('../../src/utils/broadcaster', () => ({
  default: mockBroadcaster
}))

// Mock logger
const mockLogger = {
  info: mock(() => {}),
  error: mock(() => {}),
  warn: mock(() => {}),
  debug: mock(() => {})
}
mock.module('../../src/config/logger', () => ({
  default: mockLogger
}))

// Mock Spotify service (already mocked above)

describe('MopidyHandler', () => {
  const socket = mock() as unknown
  const socketio = mock() as unknown

  beforeEach(() => {
    // Clear all mocks between tests
    mockDecoratorParse.mockClear()
    mockSpotifyValidateTrack.mockClear()
    mockBroadcaster.toClient.mockClear()
    mockBroadcaster.toAll.mockClear()
    mockBroadcaster.stateChange.mockClear()
    mockLogger.info.mockClear()
    mockLogger.error.mockClear()
    mockLogger.warn.mockClear()
    mockLogger.debug.mockClear()
  })

  test('should happy path API call with defaults', () => {
    expect.assertions(2)
    const mopidyVolumeMock = mock().mockResolvedValue(null)
    const mopidy = {
      tracklist: {
        setVolume: mopidyVolumeMock
      }
    } as unknown
    const payload = {
      key: 'tracklist.setVolume',
      data: 'data'
    }
    mockSpotifyValidateTrack.mockResolvedValue(true)
    mockDecoratorParse.mockResolvedValue('unifiedMessage')
    MopidyHandler({
      payload,
      socket: socket as Socket,
      socketio: socketio as Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockSpotifyValidateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: {
            data: 'data',
            key: 'tracklist.setVolume'
          },
          message: 'unifiedMessage'
        })
        resolve(null)
      }, 0)
    })
  })

  test('should happy path API call with arg to send to all', () => {
    expect.assertions(2)
    const mopidyVolumeMock = mock().mockResolvedValue(null)
    const mopidy = {
      tracklist: {
        setVolume: mopidyVolumeMock
      }
    } as unknown
    const payload = {
      key: 'tracklist.setVolume',
      data: 'data'
    }
    mockSpotifyValidateTrack.mockResolvedValue(true)
    mockDecoratorParse.mockResolvedValue({ message: 'message', toAll: true })
    MopidyHandler({
      payload,
      socket: socket as Socket,
      socketio: socketio as Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockSpotifyValidateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toAll).toHaveBeenCalledWith({
          socketio,
          headers: {
            data: 'data',
            key: 'tracklist.setVolume'
          },
          message: {
            message: 'message'
          }
        })
        resolve(null)
      }, 0)
    })
  })

  test('should handle api call failure', () => {
    expect.assertions(2)
    const mopidyMock = mock().mockRejectedValue(new Error('API Broke'))
    const mopidy = {
      tracklist: {
        setVolume: mopidyMock
      }
    } as unknown
    const payload = {
      key: 'tracklist.setVolume',
      data: [['12']]
    }
    MopidyHandler({
      payload,
      socket: socket as Socket,
      socketio: socketio as Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockBroadcaster.toClient).not.toHaveBeenCalled()
        expect(mockLogger.error).toHaveBeenCalledWith('Mopidy API Failure: API Broke')
        resolve(null)
      }, 0)
    })
  })

  test('should handle the full happy path API call without args', () => {
    expect.assertions(2)
    const mopidyVolumeMock = mock().mockResolvedValue(null)
    const mopidy = {
      tracklist: {
        setVolume: mopidyVolumeMock
      }
    } as unknown
    const data = null as unknown
    const payload = {
      key: 'tracklist.setVolume',
      data
    }
    mockSpotifyValidateTrack.mockResolvedValue(true)
    mockDecoratorParse.mockResolvedValue('unifiedMessage')
    MopidyHandler({
      payload,
      socket: socket as Socket,
      socketio: socketio as Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockSpotifyValidateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: { key: 'tracklist.setVolume', data: null },
          message: 'unifiedMessage'
        })
        resolve(null)
      }, 0)
    })
  })

  test('should handle an invalid track', () => {
    expect.assertions(1)
    const mopidy = {} as Mopidy
    const payload = { key: 'tracklist.add', data: { uris: ['12345zsdf23456'] } }
    mockSpotifyValidateTrack.mockRejectedValue(new Error('naughty-naughty'))
    MopidyHandler({
      payload,
      socket: socket as Socket,
      socketio: socketio as Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          headers: {
            data: { uris: ['12345zsdf23456'] },
            key: 'validationError'
          },
          message: 'unifiedMessage',
          socket
        })
        resolve(null)
      }, 0)
    })
  })
})

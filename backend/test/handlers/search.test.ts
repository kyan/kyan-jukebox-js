import { Socket } from 'socket.io'
import SearchHandler from '../../src/handlers/search'
import Broadcaster from '../../src/utils/broadcaster'
import { expect, test, describe, mock, beforeEach } from 'bun:test'

// Mock Spotify
const mockSpotifySearch = mock()
mock.module('../../src/services/spotify', () => ({
  default: {
    search: mockSpotifySearch
  }
}))

// Mock EventLogger
mock.module('../../src/utils/event-logger', () => ({
  default: {
    info: mock(() => {})
  }
}))

// Mock Spotify service (already mocked above)

// Mock Broadcaster
mock.module('../../src/utils/broadcaster', () => ({
  default: {
    toClient: mock(() => {})
  }
}))

// Mock Search Decorator
const mockDecoratorParse = mock()
mock.module('../../src/decorators/search', () => ({
  default: {
    parse: mockDecoratorParse
  }
}))

describe('SearchHandler', () => {
  const socket = {} as unknown
  const mockSocket = socket as Socket

  beforeEach(() => {
    mockSpotifySearch.mockClear()
    mockDecoratorParse.mockClear()
  })

  test('should handle a valid search', () => {
    expect.assertions(2)
    const payload = {
      key: 'searchGetTracks',
      data: 'search'
    }
    mockSpotifySearch.mockResolvedValue('tracks')
    mockDecoratorParse.mockResolvedValue('unifiedMessage')

    SearchHandler({ payload, socket: mockSocket })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(mockSpotifySearch).toHaveBeenCalledWith('search')
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: payload,
          message: 'unifiedMessage',
          type: 'search'
        })
        resolve(null)
      }, 0)
    })
  })
})

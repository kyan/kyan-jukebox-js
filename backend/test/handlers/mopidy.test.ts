import logger from '../../src/config/logger'
import Spotify from '../../src/services/spotify'
import MopidyHandler from '../../src/handlers/mopidy'
import Broadcaster from '../../src/utils/broadcaster'
import Decorator from '../../src/decorators/mopidy'
import Mopidy from 'mopidy'
jest.mock('../../src/decorators/mopidy')
jest.mock('../../src/utils/broadcaster')
jest.mock('../../src/config/logger')
jest.mock('../../src/services/spotify')

const mockSpotifyValidateTrack = Spotify.validateTrack as jest.Mock
const mockDecoratorParse = Decorator.parse as jest.Mock

describe('MopidyHandler', () => {
  const socket = jest.fn() as unknown
  const socketio = jest.fn() as unknown

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should happy path API call with defaults', () => {
    expect.assertions(2)
    const mopidyVolumeMock = jest.fn().mockResolvedValue(null)
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
      socket: socket as SocketIO.Socket,
      socketio: socketio as SocketIO.Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: {
            data: 'data',
            key: 'tracklist.setVolume'
          },
          message: 'unifiedMessage'
        })
        resolve()
      }, 0)
    })
  })

  it('should happy path API call with arg to send to all', () => {
    expect.assertions(2)
    const mopidyVolumeMock = jest.fn().mockResolvedValue(null)
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
      socket: socket as SocketIO.Socket,
      socketio: socketio as SocketIO.Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
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
        resolve()
      }, 0)
    })
  })

  it('should handle api call failure', () => {
    expect.assertions(2)
    const mopidyMock = jest.fn().mockRejectedValue(new Error('API Broke'))
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
      socket: socket as SocketIO.Socket,
      socketio: socketio as SocketIO.Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
        expect(logger.error).toHaveBeenCalledWith('Mopidy API Failure: API Broke')
        resolve()
      }, 0)
    })
  })

  it('should handle the full happy path API call without args', () => {
    expect.assertions(2)
    const mopidyVolumeMock = jest.fn().mockResolvedValue(null)
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
      socket: socket as SocketIO.Socket,
      socketio: socketio as SocketIO.Server,
      mopidy: mopidy as Mopidy
    })

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith({
          socket,
          headers: { key: 'tracklist.setVolume', data: null },
          message: 'unifiedMessage'
        })
        resolve()
      }, 0)
    })
  })

  it('should handle an invalid track', () => {
    expect.assertions(1)
    const mopidy = {} as Mopidy
    const payload = { key: 'tracklist.add', data: { uris: ['12345zsdf23456'] } }
    mockSpotifyValidateTrack.mockRejectedValue(new Error('naughty-naughty'))
    MopidyHandler({
      payload,
      socket: socket as SocketIO.Socket,
      socketio: socketio as SocketIO.Server,
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
        resolve()
      }, 0)
    })
  })
})

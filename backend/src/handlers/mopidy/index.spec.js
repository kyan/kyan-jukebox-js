import logger from 'config/winston'
import Spotify from 'services/spotify'
import MopidyHandler from './index'
import Broadcaster from 'utils/broadcaster'
import Decorator from 'decorators/mopidy'
jest.mock('decorators/mopidy')
jest.mock('utils/broadcaster')
jest.mock('config/winston')
jest.mock('services/spotify')

describe('MopidyHandler', () => {
  const ws = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle the full happy path API call with args', done => {
    expect.assertions(2)
    const mopidyVolumeMock = jest.fn().mockResolvedValue(null)
    const mopidy = {
      tracklist: {
        setVolume: mopidyVolumeMock
      }
    }
    const payload = {
      key: 'tracklist.setVolume',
      data: [['12']]
    }
    const trackMock = jest.fn().mockResolvedValue()
    Spotify.validateTrack.mockImplementation(trackMock)
    Decorator.parse.mockResolvedValue('unifiedMessage')

    MopidyHandler(payload, ws, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith(
          ws,
          { data: [['12']], key: 'tracklist.setVolume' },
          'unifiedMessage'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle api call failure', done => {
    expect.assertions(2)
    const mopidyMock = jest.fn().mockRejectedValue(new Error('API Broke'))
    const mopidy = {
      tracklist: {
        setVolume: mopidyMock
      }
    }
    const payload = {
      key: 'tracklist.setVolume',
      data: [['12']]
    }
    MopidyHandler(payload, ws, mopidy)

    setTimeout(() => {
      try {
        expect(Broadcaster.toClient).not.toHaveBeenCalled()
        expect(logger.error).toHaveBeenCalledWith('Mopidy API Failure: API Broke')
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle the full happy path API call without args', done => {
    expect.assertions(2)
    const mopidyVolumeMock = jest.fn().mockResolvedValue(null)
    const mopidy = {
      tracklist: {
        setVolume: mopidyVolumeMock
      }
    }
    const payload = { key: 'tracklist.setVolume' }
    const trackMock = jest.fn().mockResolvedValue()
    Spotify.validateTrack.mockImplementation(trackMock)
    Decorator.parse.mockResolvedValue('unifiedMessage')

    MopidyHandler(payload, ws, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(Broadcaster.toClient).toHaveBeenCalledWith(
          ws,
          { key: 'tracklist.setVolume' },
          'unifiedMessage'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle an invalid track', done => {
    expect.assertions(1)
    const mopidy = 'mopidy'
    const trackMock = jest.fn().mockRejectedValue(new Error('naughty-naughty'))
    const payload = { key: 'tracklist.add', data: { uris: ['12345zsdf23456'] } }
    Spotify.validateTrack.mockImplementation(trackMock)

    MopidyHandler(payload, ws, mopidy)

    setTimeout(() => {
      try {
        expect(Broadcaster.toClient).toHaveBeenCalledWith(
          ws,
          { data: { uris: ['12345zsdf23456'] }, key: 'validationError' },
          'naughty-naughty'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})

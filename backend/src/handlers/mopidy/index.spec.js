import logger from 'config/winston'
import Spotify from 'services/spotify'
import MopidyHandler from './index'
jest.mock('config/winston')
jest.mock('services/spotify')
jest.mock('services/mopidy/tracklist-trimmer')

describe('MopidyHandler', () => {
  const ws = jest.fn()
  const broadcastMock = jest.fn()
  const broadcasterMock = {
    to: broadcastMock
  }

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
      encoded_key: 'mopidy::tracklist.setVolume',
      data: [['12']]
    }
    const trackMock = jest.fn().mockResolvedValue()
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: [['12']], encoded_key: 'mopidy::tracklist.setVolume', key: 'tracklist.setVolume' },
          null
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
      encoded_key: 'mopidy::tracklist.setVolume',
      data: [['12']]
    }
    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(broadcastMock).not.toHaveBeenCalled()
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
    const payload = {
      key: 'tracklist.setVolume',
      encoded_key: 'mopidy::tracklist.setVolume'
    }
    const trackMock = jest.fn().mockResolvedValue()
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { encoded_key: 'mopidy::tracklist.setVolume', key: 'tracklist.setVolume' },
          null
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
    const payload = { encoded_key: 'mopidy::tracklist.add', data: [['12345zsdf23456']] }
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: [['12345zsdf23456']], encoded_key: 'mopidy::validationError' },
          'naughty-naughty'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})

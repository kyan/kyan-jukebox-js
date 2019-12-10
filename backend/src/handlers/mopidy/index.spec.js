import logger from 'config/winston'
import Spotify from 'services/spotify'
import ImageCache from './image-cache'
import MopidyHandler from './index'
jest.mock('./image-cache')
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
    expect.assertions(3)
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
    const cacheMock = jest.fn().mockResolvedValue({ image: null })
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)
    jest.spyOn(ImageCache, 'check').mockImplementation(cacheMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(ImageCache.check).toHaveBeenCalledWith(payload.encoded_key, payload.data)
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

  it('should handle the full happy path API call without args', done => {
    expect.assertions(3)
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
    const cacheMock = jest.fn().mockResolvedValue({ image: null })
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)
    jest.spyOn(ImageCache, 'check').mockImplementation(cacheMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(ImageCache.check).toHaveBeenCalledWith(payload.encoded_key, payload.data)
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

  it('should handle image request coming back', done => {
    expect.assertions(4)
    const mopidyMock = jest.fn().mockResolvedValue('true')
    const addToCacheMock = jest.fn()
    const mopidy = {
      library: {
        getImages: mopidyMock
      }
    }
    const payload = {
      key: 'library.getImages',
      encoded_key: 'mopidy::library.getImages',
      data: [['12']]
    }
    const trackMock = jest.fn().mockResolvedValue()
    const cacheMock = jest.fn().mockResolvedValue({ image: null, addToCache: addToCacheMock })
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)
    jest.spyOn(ImageCache, 'check').mockImplementation(cacheMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(addToCacheMock).toHaveBeenCalledWith('true')
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(ImageCache.check).toHaveBeenCalledWith(payload.encoded_key, payload.data)
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: [['12']], encoded_key: 'mopidy::library.getImages', key: 'library.getImages' },
          'true'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle image request coming back with nothing to add to cache', done => {
    expect.assertions(3)
    const mopidyMock = jest.fn().mockResolvedValue('true')
    const mopidy = {
      library: {
        getImages: mopidyMock
      }
    }
    const payload = {
      key: 'library.getImages',
      encoded_key: 'mopidy::library.getImages',
      data: [['12']]
    }
    const trackMock = jest.fn().mockResolvedValue()
    const cacheMock = jest.fn().mockResolvedValue({ image: null, addToCache: false })
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)
    jest.spyOn(ImageCache, 'check').mockImplementation(cacheMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(ImageCache.check).toHaveBeenCalledWith(payload.encoded_key, payload.data)
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: [['12']], encoded_key: 'mopidy::library.getImages', key: 'library.getImages' },
          'true'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle api call failure', done => {
    expect.assertions(4)
    const mopidyMock = jest.fn().mockRejectedValue(new Error('API Broke'))
    const mopidy = {
      library: {
        getImages: mopidyMock
      }
    }
    const payload = {
      key: 'library.getImages',
      encoded_key: 'mopidy::library.getImages',
      data: [['12']]
    }
    const trackMock = jest.fn().mockResolvedValue()
    const cacheMock = jest.fn().mockResolvedValue({ image: null, addToCache: false })
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)
    jest.spyOn(ImageCache, 'check').mockImplementation(cacheMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(ImageCache.check).toHaveBeenCalledWith(payload.encoded_key, payload.data)
        expect(broadcastMock).not.toHaveBeenCalled()
        expect(logger.error).toHaveBeenCalledWith('Mopidy API Failure: API Broke')
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should skip validation when found cached image', done => {
    expect.assertions(3)
    jest.spyOn(ImageCache, 'check')
    const mopidy = 'mopidy'
    const payload = { encoded_key: 'mopidy::library.getImages', data: [['12345zsdf23456']] }
    const trackMock = jest.fn().mockResolvedValue()
    const cacheMock = jest.fn().mockResolvedValue({ image: 'image' })
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)
    jest.spyOn(ImageCache, 'check').mockImplementation(cacheMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(Spotify.validateTrack).not.toHaveBeenCalled()
        expect(ImageCache.check).toHaveBeenCalledWith(payload.encoded_key, payload.data)
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: [['12345zsdf23456']], encoded_key: 'mopidy::library.getImages' },
          'image'
        )
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })

  it('should handle an invalid track', done => {
    expect.assertions(2)
    jest.spyOn(ImageCache, 'check')
    const mopidy = 'mopidy'
    const trackMock = jest.fn().mockRejectedValue(new Error('naughty-naughty'))
    const payload = { encoded_key: 'mopidy::tracklist.add', data: [['12345zsdf23456']] }
    jest.spyOn(Spotify, 'validateTrack').mockImplementation(trackMock)

    MopidyHandler(payload, ws, broadcasterMock, mopidy)

    setTimeout(() => {
      try {
        expect(broadcastMock).toHaveBeenCalledWith(
          ws,
          { data: [['12345zsdf23456']], encoded_key: 'mopidy::tracklist.validation' },
          'naughty-naughty'
        )
        expect(ImageCache.check).not.toHaveBeenCalled()
        done()
      } catch (err) {
        done.fail(err)
      }
    })
  })
})

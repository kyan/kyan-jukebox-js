import NowPlaying from './index'
import HttpService from 'services/http'

describe('NowPlaying', () => {
  describe('addTrack', () => {
    const httpMock = jest.fn()
    const title = 'Seasons (Waiting On You)'
    const artist = 'Future Islands'
    const album = 'Singles'
    const trackObject = {
      name: title,
      artist: { name: artist },
      album: { name: album }
    }
    beforeAll(() => {
      jest.spyOn(HttpService, 'post').mockImplementation(httpMock)
    })
    afterEach(() => {
      jest.resetAllMocks()
      delete process.env.NOW_PLAYING_URL
    })

    it('when the NOW_PLAYING_URL is set it calls to the HTTP service', () => {
      const url = 'https://addthetrack.com'
      process.env.NOW_PLAYING_URL = url
      NowPlaying.addTrack(trackObject)
      expect(httpMock).toHaveBeenCalledWith({
        url,
        data: {
          added_by: 'Jukebox JS',
          title,
          artist,
          album
        }
      })
    })

    it('when the NOW_PLAYING_URL is not set it does nothing', () => {
      NowPlaying.addTrack(trackObject)
      expect(httpMock).not.toHaveBeenCalled()
    })
  })
})

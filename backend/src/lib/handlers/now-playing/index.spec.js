import NowPlaying from './index'
import HttpService from '../../services/http'

describe('NowPlaying', () => {
  describe('addTrack', () => {
    const httpMock = jest.fn()
    const trackObject = {
      name: 'Seasons (Waiting On You)',
      artist: { name: 'Future Islands' },
      album: { name: 'Singles' }
    }
    beforeAll(() => {
      jest.spyOn(HttpService, 'post').mockImplementation(httpMock)
    })
    afterEach(() => {
      jest.resetAllMocks()
      delete process.env.NOW_PLAYING_URL
    })

    it('when the NOW_PLAYING_URL is set it calls to the HTTP service', () => {
      process.env.NOW_PLAYING_URL = 'addthetrack.com'
      NowPlaying.addTrack(trackObject)
      expect(httpMock).toHaveBeenCalledWith({
        url: 'addthetrack.com',
        data: {
          added_by: 'Jukebox JS',
          title: 'Seasons (Waiting On You)',
          artist: 'Future Islands',
          album: 'Singles'
        }
      })
    })

    it('when the NOW_PLAYING_URL is not set it does nothing', () => {
      NowPlaying.addTrack(trackObject)
      expect(httpMock).not.toHaveBeenCalled()
    })
  })
})

import Setting from '../../src/models/setting'
import logger from '../../src/config/logger'
import NowPlaying from '../../src/utils/now-playing'
import { JBTrack } from '../../src/models/track'
jest.mock('../../src/config/logger')

describe('NowPlaying', () => {
  describe('addTrack', () => {
    const trackObject: JBTrack = {
      uri: 'uri000',
      name: 'Seasons (Waiting On You)',
      year: '1983',
      image: 'the-album-art.jpg',
      length: 1234,
      artist: {
        uri: 'uri123',
        name: 'Future Islands'
      },
      album: {
        uri: 'uri321',
        name: 'Singles',
        year: '2019'
      },
      metrics: {
        votesAverage: 80,
        votes: 2,
        plays: 2
      },
      addedBy: [
        {
          user: {
            fullname: 'Duncan'
          },
          addedAt: new Date(1582010703141)
        },
        {
          user: {
            fullname: 'BRH'
          },
          addedAt: new Date(1582000703141)
        }
      ]
    }

    it('returns the correct payload when full data', () => {
      const result = {} as any
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(result)
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)

      return NowPlaying.addTrack(trackObject).then((payload) => {
        expect(payload).toMatchSnapshot()
      })
    })

    it('returns the correct payload when full data 1', () => {
      const result = {} as any
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(result)
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)
      trackObject.metrics.plays = 1
      delete trackObject.addedBy[1]

      return NowPlaying.addTrack(trackObject).then((payload) => {
        expect(payload).toMatchSnapshot()
      })
    })

    it('handles errors', () => {
      jest.spyOn(Setting, 'findOneAndUpdate').mockRejectedValue(new Error('oooops'))
      NowPlaying.addTrack(trackObject)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('NowPlaying.addTrack: oooops')
          resolve()
        }, 0)
      })
    })
  })
})

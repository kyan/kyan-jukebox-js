import Setting from '../../src/models/setting'
import logger from '../../src/config/logger'
import NowPlaying from '../../src/utils/now-playing'
jest.mock('../../src/config/logger')

describe('NowPlaying', () => {
  describe('addTrack', () => {
    const trackObject = {
      name: 'Seasons (Waiting On You)',
      year: '1983',
      image: 'the-album-art.jpg',
      artist: {
        name: 'Future Islands'
      },
      album: {
        name: 'Singles'
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
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue()
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)

      return NowPlaying.addTrack(trackObject)
        .then(payload => {
          expect(payload).toMatchSnapshot()
        })
    })

    it('returns the correct payload when full data 1', () => {
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue()
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)
      trackObject.metrics.plays = 1
      delete trackObject.addedBy[1]

      return NowPlaying.addTrack(trackObject)
        .then(payload => {
          expect(payload).toMatchSnapshot()
        })
    })

    it('handles errors', () => {
      jest.spyOn(Setting, 'findOneAndUpdate').mockRejectedValue(new Error('oooops'))
      NowPlaying.addTrack(trackObject)

      return new Promise(resolve => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('NowPlaying.addTrack: oooops')
          resolve()
        }, 0)
      })
    })
  })
})

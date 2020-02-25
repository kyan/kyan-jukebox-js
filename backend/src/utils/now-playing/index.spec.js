import Setting from 'services/mongodb/models/setting'
import logger from 'config/winston'
import NowPlaying from './index'
jest.mock('config/winston')

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

    it('handles errors', done => {
      jest.spyOn(Setting, 'findOneAndUpdate').mockRejectedValue(new Error('oooops'))
      NowPlaying.addTrack(trackObject)

      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('NowPlaying.addTrack: oooops')
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })
})

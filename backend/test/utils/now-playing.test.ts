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

    it('returns the correct payload when full data', async () => {
      expect.assertions(11)
      const result = {} as any
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(result)
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)

      const payload = (await NowPlaying.addTrack(trackObject)) as any

      expect(payload).toHaveProperty('title', 'Seasons (Waiting On You)')
      expect(payload).toHaveProperty('artist', 'Future Islands')
      expect(payload).toHaveProperty('album', 'Singles')
      expect(payload).toHaveProperty('year', '1983')
      expect(payload).toHaveProperty('image', 'the-album-art.jpg')
      expect(payload).toHaveProperty('spotify', 'https://open.spotify.com/track/uri000')
      expect(payload).toHaveProperty('added_by', 'Duncan')
      expect(payload).toHaveProperty('added_at', '3 hours ago')
      expect(payload).toHaveProperty('last_played', '6 hours ago')
      expect(payload.metrics).toMatchObject({
        plays: 2,
        rating: 3,
        votes: 2
      })
      expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'json' },
        { $set: { 'value.currentTrack': payload } },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
    })

    it('returns the correct payload when partial full data', async () => {
      expect.assertions(11)
      const result = {} as any
      jest.spyOn(Setting, 'findOneAndUpdate').mockResolvedValue(result)
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)
      trackObject.metrics.plays = 1
      delete trackObject.addedBy[1]

      const payload = (await NowPlaying.addTrack(trackObject)) as any

      expect(payload).toHaveProperty('title', 'Seasons (Waiting On You)')
      expect(payload).toHaveProperty('artist', 'Future Islands')
      expect(payload).toHaveProperty('album', 'Singles')
      expect(payload).toHaveProperty('year', '1983')
      expect(payload).toHaveProperty('image', 'the-album-art.jpg')
      expect(payload).toHaveProperty('spotify', 'https://open.spotify.com/track/uri000')
      expect(payload).toHaveProperty('added_by', 'Duncan')
      expect(payload).toHaveProperty('added_at', '3 hours ago')
      expect(payload).toHaveProperty('last_played', null)
      expect(payload.metrics).toMatchObject({
        plays: 1,
        rating: 3,
        votes: 2
      })
      expect(Setting.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'json' },
        { $set: { 'value.currentTrack': payload } },
        { runValidators: true, setDefaultsOnInsert: true, upsert: true }
      )
    })

    it('handles errors', () => {
      expect.assertions(1)
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

import logger from '../../src/config/logger'
import NowPlaying from '../../src/utils/now-playing'
import { getDatabase } from '../../src/services/database/factory'
import { JBTrack } from '../../src/types/database'

jest.mock('../../src/config/logger')
jest.mock('../../src/services/database/factory')

// Mock database service
const mockDatabase = {
  settings: {
    updateJsonSetting: jest.fn()
  }
}

const mockGetDatabase = getDatabase as jest.Mock
mockGetDatabase.mockReturnValue(mockDatabase)

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
        votesTotal: 160,
        votes: 2,
        plays: 2
      },
      addedBy: [
        {
          user: {
            _id: 'user1',
            fullname: 'Duncan',
            email: 'duncan@example.com'
          },
          addedAt: new Date(1582010703141),
          played: [],
          votes: []
        },
        {
          user: {
            _id: 'user2',
            fullname: 'BRH',
            email: 'brh@example.com'
          },
          addedAt: new Date(1582000703141),
          played: [],
          votes: []
        }
      ]
    }

    it('returns the correct payload when full data', async () => {
      expect.assertions(11)
      mockDatabase.settings.updateJsonSetting.mockResolvedValue(undefined)
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
      expect(mockDatabase.settings.updateJsonSetting).toHaveBeenCalledWith(
        'json',
        payload
      )
    })

    it('returns the correct payload when partial full data', async () => {
      expect.assertions(11)
      mockDatabase.settings.updateJsonSetting.mockResolvedValue(undefined)
      jest.spyOn(global.Date, 'now').mockImplementation(() => 1582020703141)

      const modifiedTrack = {
        ...trackObject,
        metrics: {
          ...trackObject.metrics,
          plays: 1
        },
        addedBy: [trackObject.addedBy[0]] // Only first user
      }

      const payload = (await NowPlaying.addTrack(modifiedTrack)) as any

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
      expect(mockDatabase.settings.updateJsonSetting).toHaveBeenCalledWith(
        'json',
        payload
      )
    })

    it('handles errors', () => {
      expect.assertions(1)
      mockDatabase.settings.updateJsonSetting.mockRejectedValue(new Error('oooops'))
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

import lodash from 'lodash'
import Mopidy from 'mopidy'
import SpotifyService from '../../src/services/spotify'
import EventLogger from '../../src/utils/event-logger'
import ImageCache, { ImageCacheData } from '../../src/utils/image-cache'
import Recommend, { SuitableExtractedData } from '../../src/utils/recommendations'
import logger from '../../src/config/logger'
import { getDatabase } from '../../src/services/database/factory'

jest.mock('../../src/utils/recommendations')
jest.mock('../../src/utils/image-cache')
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/config/logger')
jest.mock('../../src/services/database/factory')
jest.mock('spotify-web-api-node', () => {
  return function () {
    const tracks = [
      {
        uri: 'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
        album: {
          uri: 'spotify:album:0ZUo4YjG4saFnEJhdWp9Bt',
          images: [
            {
              url: 'https://i.scdn.co/dfaf92'
            }
          ]
        }
      },
      {
        uri: 'spotify:track:03fT3OHB9KyMtGMt2zwqCT',
        album: {
          uri: 'spotify:album:03fT3OHB9KyMtGMt2zwqCT',
          images: [
            {
              url: 'https://i.scdn.co/1d873289c511dfaf92'
            }
          ]
        }
      },
      { uri: 'spotify:track:7LzeKqmOtpKVKJ1dmalkC0' },
      { uri: 'spotify:track:1Ut1A8UaNqGuwsHgWq75PW' }
    ]
    return {
      clientCredentialsGrant: jest
        .fn()
        .mockImplementation(() => Promise.resolve({ body: {} })),
      getRecommendations: jest.fn().mockResolvedValue({ body: { tracks } }),
      setAccessToken: jest.fn(),
      getTracks: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ body: { tracks: [{ explicit: true, name: 'Naughty' }] } })
        ),
      getArtists: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve({ body: { artists: [{ name: 'Yahzoo' }] } })
        ),
      searchTracks: jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({ body: { tracks: { items: [] } } })
        )
        .mockImplementationOnce(() => Promise.reject(new Error('search bang!')))
    }
  }
})
jest.mock('lodash', () => ({
  sampleSize: (list: lodash.Dictionary<unknown[]>) => list
}))

const mockedRecommend = Recommend as jest.Mocked<typeof Recommend>
const mockedImageCache = ImageCache as jest.Mocked<typeof ImageCache>

// Mock database service
const mockDatabase = {
  tracks: {
    addTracks: jest.fn(),
    findByUris: jest.fn()
  },
  settings: {
    getTracklist: jest.fn()
  }
}

const mockGetDatabase = getDatabase as jest.Mock
mockGetDatabase.mockReturnValue(mockDatabase)

describe('SpotifyService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getTracks', () => {
    it('should handle tracks', () => {
      expect.assertions(1)
      mockedImageCache.addAll.mockResolvedValue({})

      return SpotifyService.getTracks(['spotify:track:03fT3OHB9KyMtGMtNEW']).then(
        (result) => {
          expect(result).toEqual({ tracks: [{ explicit: true, name: 'Naughty' }] })
        }
      )
    })
  })

  describe('getArtists', () => {
    it('should handle artists', () => {
      expect.assertions(1)

      return SpotifyService.getArtists(['spotify:artist:03fT3OHB9KyMtGMtNEW']).then(
        (result) => {
          expect(result).toEqual([{ name: 'Yahzoo' }])
        }
      )
    })
  })

  describe('canRecommend', () => {
    it('should return nothing if no recommendations should be attempted', () => {
      expect.assertions(1)
      const mopidy = {
        tracklist: {
          getNextTlid: jest.fn().mockImplementationOnce(() => Promise.resolve(123))
        }
      } as unknown
      return SpotifyService.canRecommend(mopidy as Mopidy).then((result) => {
        expect(result).toBeNull()
      })
    })

    it('should handle some recomendations', () => {
      expect.assertions(3)
      const mopidy = {
        tracklist: {
          getNextTlid: jest.fn().mockResolvedValue(null),
          add: jest.fn().mockResolvedValue('track added OK')
        }
      } as unknown
      const uris = [
        'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
        'spotify:track:7LzeKqmOtpKVKJ1dmalkC0',
        'spotify:track:1Ut1A8UaNqGuwsHgWq75PW'
      ]
      const images = {} as ImageCacheData
      const results = [{ _id: 'meh' }] as any[]
      mockedRecommend.extractSuitableData.mockResolvedValue({} as SuitableExtractedData)
      mockedRecommend.enrichWithPopularTracksIfNeeded.mockResolvedValue({ images, uris })
      mockDatabase.tracks.addTracks.mockResolvedValue({ user: 'duncan' })
      mockedImageCache.addAll.mockResolvedValue({})
      mockDatabase.tracks.findByUris.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(results)
      }))

      return SpotifyService.canRecommend(mopidy as Mopidy).then((result) => {
        expect(result).toEqual(expect.any(Function))

        return result(uris, mopidy as Mopidy).then((result) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              expect(result).toBeUndefined()
              expect(EventLogger.info).toHaveBeenCalledWith(
                'INCOMING RECOMMENDATIONS',
                {
                  data: [
                    'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
                    'spotify:track:7LzeKqmOtpKVKJ1dmalkC0',
                    'spotify:track:1Ut1A8UaNqGuwsHgWq75PW'
                  ],
                  key: 'tracklist.add',
                  response: 'track added OK',
                  user: 'duncan'
                },
                true
              )
              resolve()
            }, 0)
          })
        })
      })
    })

    it('should handle no recomendations', () => {
      expect.assertions(2)
      const mopidy = {
        tracklist: {
          getNextTlid: jest.fn().mockImplementationOnce(() => Promise.resolve(null))
        }
      } as unknown
      return SpotifyService.canRecommend(mopidy as Mopidy).then((result) => {
        expect(result).toEqual(expect.any(Function))

        const uris: string[] = []
        return result(uris, mopidy as Mopidy).then((result) => {
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              expect(result).toBeUndefined()
              resolve()
            }, 0)
          })
        })
      })
    })

    it('should log an error if getNextTlid bails', () => {
      expect.assertions(1)
      const mopidy = {
        tracklist: {
          getNextTlid: jest.fn().mockRejectedValue(new Error('getNextTlid broke'))
        }
      } as unknown
      SpotifyService.canRecommend(mopidy as Mopidy)

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('nextTrack: getNextTlid broke')
          resolve()
        }, 0)
      })
    })
  })

  describe('explicit content', () => {
    it('should resolve OK', () => {
      expect.assertions(1)
      mockDatabase.settings.getTracklist.mockResolvedValue([
        'spotify:track:03fT3OHB9KyMtGMt2zwqCT',
        'spotify:track:1yzSSn5Sj1azuo7RgwvDb3'
      ])
      const track = { explicit: false, name: 'Handbags' } as SpotifyApi.TrackObjectFull
      jest.spyOn(SpotifyService, 'getTracks').mockResolvedValue({ tracks: [track] })

      return SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW').then(
        (response) => {
          expect(response).toEqual(true)
        }
      )
    })
  })

  describe('when explicit and content is NOT allowed', () => {
    afterEach(() => {
      process.env.EXPLICIT_CONTENT = 'true'
    })

    it('should show error message', () => {
      process.env.EXPLICIT_CONTENT = 'false'
      expect.assertions(1)
      const track = { explicit: true, name: 'Handbags' } as SpotifyApi.TrackObjectFull
      jest.spyOn(SpotifyService, 'getTracks').mockResolvedValue({ tracks: [track] })
      mockDatabase.settings.getTracklist.mockResolvedValue([
        'spotify:track:03fT3OHB9KyMtGMt2zwqCT'
      ])

      return SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW').catch(
        (error) => {
          expect(error.message).toEqual('Not suitable. Is there a radio mix? - Handbags')
        }
      )
    })
  })

  describe('validateTrack', () => {
    it('should reject if track is already in tracklist', () => {
      expect.assertions(1)
      mockDatabase.settings.getTracklist.mockResolvedValue([
        'spotify:track:03fT3OHB9KyMtGMt2zwqCT',
        'spotify:track:1yzSSn5Sj1azuo7RgwvDb3'
      ])

      return SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMt2zwqCT').catch(
        (error) => {
          expect(error.message).toEqual(
            "You've already added: spotify:track:03fT3OHB9KyMtGMt2zwqCT"
          )
        }
      )
    })

    it('should resolve if track is valid', async () => {
      expect.assertions(1)
      mockDatabase.settings.getTracklist.mockResolvedValue([
        'spotify:track:03fT3OHB9KyMtGMt2zwqCT'
      ])
      const track = { explicit: false, name: 'Handbags' } as SpotifyApi.TrackObjectFull
      jest.spyOn(SpotifyService, 'getTracks').mockResolvedValue({ tracks: [track] })

      const result = await SpotifyService.validateTrack(
        'spotify:track:03fT3OHB9KyMtGMtNEW'
      )
      expect(result).toEqual(true)
    })

    it('should log if track is broken', () => {
      expect.assertions(1)
      mockDatabase.settings.getTracklist.mockResolvedValue([
        'spotify:track:03fT3OHB9KyMtGMt2zwqCT'
      ])
      jest.spyOn(SpotifyService, 'getTracks').mockRejectedValue(new Error('bang!'))
      SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW')

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('getTracks: bang!')
          resolve()
        }, 0)
      })
    })
  })

  describe('search', () => {
    it('should resolve search', async () => {
      expect.assertions(1)
      mockedImageCache.addAll.mockResolvedValue({})

      const result = await SpotifyService.search({
        query: 'hello',
        options: {
          offset: 0,
          limit: 10
        }
      })
      expect(result).toEqual({ tracks: { items: [] } })
    })

    it('should reject when search fails', () => {
      expect.assertions(1)
      SpotifyService.search({
        query: 'hello',
        options: {
          offset: 0,
          limit: 10
        }
      })

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('searchTracks: search bang!')
          resolve()
        }, 0)
      })
    })
  })
})

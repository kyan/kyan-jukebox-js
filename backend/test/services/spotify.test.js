import SpotifyService from '../../src/services/spotify'
import EventLogger from '../../src/utils/event-logger'
import ImageCache from '../../src/utils/image-cache'
import Recommend from '../../src/utils/recommendations'
import logger from '../../src/config/logger'
import Track, { addTracks } from '../../src/models/track'
import { getTracklist } from '../../src/models/setting'

jest.mock('../../src/utils/recommendations')
jest.mock('../../src/models/setting')
jest.mock('../../src/utils/image-cache')
jest.mock('../../src/models/track')
jest.mock('../../src/utils/event-logger')
jest.mock('../../src/config/logger')
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
  sampleSize: (list) => list
}))

describe('SpotifyService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getTracks', () => {
    it('should handle tracks', () => {
      expect.assertions(1)
      ImageCache.addAll.mockResolvedValue()
      return SpotifyService.getTracks(['spotify:track:03fT3OHB9KyMtGMtNEW']).then(
        (result) => {
          expect(result).toEqual({ tracks: [{ explicit: true, name: 'Naughty' }] })
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
      }
      return SpotifyService.canRecommend(mopidy).then((result) => {
        expect(result).toBeUndefined()
      })
    })

    it('should handle some recomendations', () => {
      expect.assertions(3)
      const mopidy = {
        tracklist: {
          getNextTlid: jest.fn().mockResolvedValue(null),
          add: jest.fn().mockResolvedValue('track added OK')
        }
      }
      const uris = [
        'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
        'spotify:track:7LzeKqmOtpKVKJ1dmalkC0',
        'spotify:track:1Ut1A8UaNqGuwsHgWq75PW'
      ]
      Recommend.extractSuitableData.mockResolvedValue()
      Recommend.addRandomUris.mockResolvedValue({ images: 'images', uris })
      addTracks.mockImplementation(() => Promise.resolve({ user: 'duncan' }))
      ImageCache.addAll.mockResolvedValue()
      Track.find.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue([{ _id: 'meh' }])
      }))

      return SpotifyService.canRecommend(mopidy).then((result) => {
        expect(result).toEqual(expect.any(Function))

        return result(uris, mopidy).then((result) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              expect(result).toBeUndefined()
              expect(EventLogger.info).toHaveBeenCalledWith(
                'INCOMING MOPIDY',
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
            })
          }, 0)
        })
      })
    })

    it('should handle no recomendations', () => {
      expect.assertions(2)
      const mopidy = {
        tracklist: {
          getNextTlid: jest.fn().mockImplementationOnce(() => Promise.resolve(null))
        }
      }
      return SpotifyService.canRecommend(mopidy).then((result) => {
        expect(result).toEqual(expect.any(Function))

        const uris = []
        return result(uris, mopidy).then((result) => {
          return new Promise((resolve) => {
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
      }
      SpotifyService.canRecommend(mopidy)

      return new Promise((resolve) => {
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
      getTracklist.mockResolvedValue([
        'spotify:track:03fT3OHB9KyMtGMt2zwqCT',
        'spotify:track:1yzSSn5Sj1azuo7RgwvDb3'
      ])
      jest
        .spyOn(SpotifyService, 'getTracks')
        .mockResolvedValue({ tracks: [{ explicit: false, name: 'Handbags' }] })

      return SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW').then(
        (response) => {
          expect(response).toEqual(true)
        }
      )
    })
  })

  describe('when explicit and content is NOT allowed', () => {
    afterEach(() => {
      process.env.EXPLICIT_CONTENT = true
    })

    it('should show error message', () => {
      process.env.EXPLICIT_CONTENT = false
      expect.assertions(1)
      jest
        .spyOn(SpotifyService, 'getTracks')
        .mockResolvedValue({ tracks: [{ explicit: true, name: 'Handbags' }] })
      getTracklist.mockResolvedValue(['spotify:track:03fT3OHB9KyMtGMt2zwqCT'])

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
      getTracklist.mockResolvedValue([
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

    it('should resolve if track is valid', () => {
      expect.assertions(1)
      getTracklist.mockResolvedValue(['spotify:track:03fT3OHB9KyMtGMt2zwqCT'])
      jest
        .spyOn(SpotifyService, 'getTracks')
        .mockResolvedValue({ tracks: [{ explicit: false, name: 'Handbags' }] })

      return SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW').then(
        (result) => {
          expect(result).toEqual(true)
        }
      )
    })

    it('should log if track is broken', () => {
      expect.assertions(1)
      getTracklist.mockResolvedValue(['spotify:track:03fT3OHB9KyMtGMt2zwqCT'])
      jest.spyOn(SpotifyService, 'getTracks').mockRejectedValue(new Error('bang!'))
      SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW')

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('getTracks: bang!')
          resolve()
        }, 0)
      })
    })
  })

  describe('search', () => {
    it('should resolve search', () => {
      expect.assertions(1)
      ImageCache.addAll.mockResolvedValue()

      return SpotifyService.search('hello', {}).then((result) => {
        expect(result).toEqual({ tracks: { items: [] } })
      })
    })

    it('should reject when search fails', () => {
      expect.assertions(1)
      SpotifyService.search('hello', {})

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(logger.error).toHaveBeenCalledWith('searchTracks: search bang!')
          resolve()
        }, 0)
      })
    })
  })
})

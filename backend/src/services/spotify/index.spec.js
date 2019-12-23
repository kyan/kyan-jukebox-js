import SpotifyService from './index'
import EventLogger from 'utils/event-logger'
import logger from 'config/winston'
import { addTracks } from 'utils/track'

jest.mock('utils/track')
jest.mock('utils/event-logger')
jest.mock('config/winston')
jest.mock('spotify-web-api-node', () => {
  return function () {
    const tracks = [
      { uri: 'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt' },
      { uri: 'spotify:track:03fT3OHB9KyMtGMt2zwqCT' },
      { uri: 'spotify:track:7LzeKqmOtpKVKJ1dmalkC0' },
      { uri: 'spotify:track:1Ut1A8UaNqGuwsHgWq75PW' }
    ]
    return {
      clientCredentialsGrant: jest.fn()
        .mockImplementation(() => Promise.resolve({ body: {} })),
      getRecommendations: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ body: { tracks } })),
      setAccessToken: jest.fn(),
      getTracks: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ body: { tracks: [{ explicit: true, name: 'Naughty' }] } }))
        .mockImplementationOnce(() => Promise.resolve({ body: { tracks: [{ explicit: false }] } }))
        .mockImplementationOnce(() => Promise.reject(new Error('bang!'))),
      searchTracks: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ body: 'search results' }))
        .mockImplementationOnce(() => Promise.reject(new Error('search bang!')))
    }
  }
})
jest.mock('utils/local-storage', () => ({
  getItem: () => ['spotify:track:03fT3OHB9KyMtGMt2zwqCT', 'spotify:track:1yzSSn5Sj1azuo7RgwvDb3']
}))
jest.mock('lodash', () => ({
  sampleSize: (list) => list
}))

describe('SpotifyService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('canRecommend', () => {
    it('should return nothing if no recommendations should be attempted', done => {
      expect.assertions(1)
      const mopidy = {
        tracklist: {
          nextTrack: jest.fn()
            .mockImplementationOnce(() => Promise.resolve('somedata'))
        }
      }
      SpotifyService.canRecommend(mopidy)
        .then((result) => {
          expect(result).toBeUndefined()
          done()
        })
    })

    it('should handle some recomendations', done => {
      expect.assertions(3)
      const mopidy = {
        tracklist: {
          nextTrack: jest.fn()
            .mockImplementationOnce(() => Promise.resolve(null)),
          add: jest.fn()
            .mockImplementationOnce(() => Promise.resolve('track added OK'))
        }
      }
      addTracks.mockImplementation(() => Promise.resolve('uris'))

      SpotifyService.canRecommend(mopidy)
        .then((result) => {
          expect(result).toEqual(jasmine.any(Function))

          const uris = [
            'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
            'spotify:track:7LzeKqmOtpKVKJ1dmalkC0',
            'spotify:track:1Ut1A8UaNqGuwsHgWq75PW'
          ]
          result(uris, mopidy)
            .then((result) => {
              setTimeout(() => {
                try {
                  expect(result).toBeUndefined()
                  expect(EventLogger).toHaveBeenCalledWith(
                    { encoded_key: 'mopidy.tracklist.add' },
                    { uris: [
                      'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
                      'spotify:track:7LzeKqmOtpKVKJ1dmalkC0',
                      'spotify:track:1Ut1A8UaNqGuwsHgWq75PW'
                    ] },
                    'track added OK',
                    'APIRequest'
                  )
                  done()
                } catch (err) {
                  done.fail(err)
                }
              })
            })
        })
    })

    it('should handle no recomendations', done => {
      expect.assertions(2)
      const mopidy = {
        tracklist: {
          nextTrack: jest.fn()
            .mockImplementationOnce(() => Promise.resolve(null))
        }
      }
      SpotifyService.canRecommend(mopidy)
        .then((result) => {
          expect(result).toEqual(jasmine.any(Function))

          const uris = []
          result(uris, mopidy)
            .then((result) => {
              expect(result).toBeUndefined()
              done()
            })
        })
    })

    it('should log an error if nextTrack bails', done => {
      expect.assertions(1)
      const mopidy = {
        tracklist: {
          nextTrack: jest.fn().mockRejectedValue(new Error('nextTrack broke'))
        }
      }
      SpotifyService.canRecommend(mopidy)
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('nextTrack: nextTrack broke')
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })

  describe('validateTrack', () => {
    it('should reject if track is already in tracklist', done => {
      expect.assertions(1)
      SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMt2zwqCT')
        .catch((error) => {
          expect(error.message).toEqual('Already in tracklist: spotify:track:03fT3OHB9KyMtGMt2zwqCT')
          done()
        })
    })

    it('should reject if track is explicit', done => {
      expect.assertions(1)
      SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW')
        .catch((error) => {
          expect(error.message).toEqual('Not suitable. Is there a radio mix? - Naughty')
          done()
        })
    })

    it('should resolve if track is valid', done => {
      expect.assertions(1)
      SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW')
        .then((result) => {
          expect(result).toEqual(true)
          done()
        })
    })

    it('should log if track is broken', done => {
      expect.assertions(1)
      SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMtNEW')
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('getTracks: bang!')
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })

  describe('search', () => {
    it('should resolve search', done => {
      expect.assertions(1)
      SpotifyService.search('hello', {})
        .then((result) => {
          expect(result).toEqual('search results')
          done()
        })
    })

    it('should reject when search fails', done => {
      expect.assertions(1)
      SpotifyService.search('hello', {})
      setTimeout(() => {
        try {
          expect(logger.error).toHaveBeenCalledWith('searchTracks: search bang!')
          done()
        } catch (err) {
          done.fail(err)
        }
      })
    })
  })
})

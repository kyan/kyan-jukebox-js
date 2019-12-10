import SpotifyService from './index'

jest.mock('config/winston')
jest.mock('spotify-web-api-node', () => {
  return function () {
    return {
      clientCredentialsGrant: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ body: {} }))
        .mockImplementationOnce(() => Promise.resolve({ body: {} }))
        .mockImplementationOnce(() => Promise.resolve({ body: {} })),
      getRecommendations: jest.fn()
        .mockImplementation(() => Promise.resolve({ body: {
          tracks: [
            { uri: 'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt' },
            { uri: 'spotify:track:03fT3OHB9KyMtGMt2zwqCT' },
            { uri: 'spotify:track:7LzeKqmOtpKVKJ1dmalkC0' },
            { uri: 'spotify:track:1Ut1A8UaNqGuwsHgWq75PW' }
          ]
        }})),
      setAccessToken: jest.fn(),
      getTrack: jest.fn()
        .mockImplementationOnce(() => Promise.resolve({ body: { explicit: true, name: 'Naughty' } }))
        .mockImplementationOnce(() => Promise.resolve({ body: { explicit: false } }))
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
  const mopidy = {
    tracklist: {
      nextTrack: jest.fn()
        .mockImplementationOnce(() => Promise.resolve('data'))
        .mockImplementationOnce(() => Promise.resolve()),
      add: jest.fn()
        .mockImplementationOnce(() => Promise.resolve('track added OK'))
    }
  }
  const mockCallback = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('canRecommend', () => {
    it('should behave as expected', async () => {
      expect.assertions(3)
      await SpotifyService.canRecommend(mopidy, mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(0)
      await SpotifyService.canRecommend(mopidy, mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(1)

      const uris = [
        'spotify:track:0ZUo4YjG4saFnEJhdWp9Bt',
        'spotify:track:7LzeKqmOtpKVKJ1dmalkC0',
        'spotify:track:1Ut1A8UaNqGuwsHgWq75PW'
      ]
      await mockCallback.mock.calls[0][0](uris, mopidy)
      expect(mopidy.tracklist.add.mock.calls[0][0]).toEqual({
        uris: uris
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
          expect(error.message).toEqual('Is there a radio mix? - Naughty')
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
  })
})

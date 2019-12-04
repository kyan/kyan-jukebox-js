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
        .mockImplementationOnce(() => Promise.resolve({ body: { explicit: false } }))
        .mockImplementationOnce(() => Promise.resolve({ body: { explicit: true } }))
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

  describe('canRecommend', () => {
    it('should behave as expected', async () => {
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
    it('should correctly handle various scenarios', async () => {
      await SpotifyService.validateTrack('spotify:track:03fT3OHB9KyMtGMt2zwqCT', mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(0)
      await SpotifyService.validateTrack('unique', mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(0)
      await SpotifyService.validateTrack('unique', mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(1)
    })
  })
})

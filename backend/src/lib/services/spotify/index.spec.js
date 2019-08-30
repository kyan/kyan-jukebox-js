import SpotifyService from './index'

jest.mock('../../../config/winston')
jest.mock('spotify-web-api-node', () => {
  return function () {
    return {
      clientCredentialsGrant: jest.fn()
        .mockImplementation(() => Promise.resolve({ body: {} })),
      getRecommendations: jest.fn()
        .mockImplementation(() => Promise.resolve({ body: {
          tracks: [
            { uri: 'spotify:track:1yzSSn5Sj1azuo7Rgwv111' },
            { uri: 'spotify:track:1yzSSn5Sj1azuo7Rgwv222' }
          ]
        }})),
      setAccessToken: jest.fn()
    }
  }
})

describe('SpotifyService', () => {
  const mopidy = {
    tracklist: {
      nextTrack: jest.fn()
        .mockImplementationOnce(() => Promise.resolve('data'))
        .mockImplementationOnce(() => Promise.resolve()),
      add: jest.fn()
    }
  }
  const mockCallback = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('canRecommend', () => {
    it('should behave as expected', async () => {
      await SpotifyService.canRecommend(mopidy, mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(0)
      await SpotifyService.canRecommend(mopidy, mockCallback)
      expect(mockCallback.mock.calls.length).toEqual(1)

      const uris = [
        'spotify:track:1yzSSn5Sj1azuo7RgwvDb3',
        'spotify:track:1123SSn5j1azuo7RgwvDb4'
      ]
      await mockCallback.mock.calls[0][0](uris, mopidy)
    })
  })
})

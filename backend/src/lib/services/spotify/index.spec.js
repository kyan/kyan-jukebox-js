import SpotifyService from './index'

jest.mock('../../../config/winston')

const mopidy = {
  tracklist: {
    nextTrack: jest.fn()
      .mockImplementationOnce(() => Promise.resolve('data'))
      .mockImplementationOnce(() => Promise.resolve())
  }
}

describe('SpotifyService', () => {
  const mockFn = jest.fn()

  describe('canRecommend', () => {
    it('should handle both cases', async () => {
      await SpotifyService.canRecommend(mopidy, mockFn)
      expect(mockFn.mock.calls.length).toEqual(0)
      await SpotifyService.canRecommend(mopidy, mockFn)
      expect(mockFn.mock.calls.length).toEqual(1)
    })
  })
})

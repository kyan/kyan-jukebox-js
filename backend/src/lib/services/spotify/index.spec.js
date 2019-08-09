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
    it('should handle both cases', () => {
      SpotifyService.canRecommend(mopidy, mockFn)
      SpotifyService.canRecommend(mopidy, mockFn)
    })
  })
})

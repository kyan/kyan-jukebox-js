import DecorateSearchResults from '../../src/decorators/result'
import SearchDecorator from '../../src/decorators/search'
jest.mock('../../src/decorators/result')

const mockDecorateSearchResults = DecorateSearchResults as jest.Mock

describe('SearchDecorator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle skipping', async () => {
    expect.assertions(1)
    const header = {
      key: 'keynotused',
      data: {}
    }
    const data = {}

    const results = await SearchDecorator.parse(header, data)
    expect(results).toEqual('skippedSearchDecoratorDecoration: keynotused')
  })

  describe('SEARCH_GET_TRACKS', () => {
    it('calls the DecorateSearchResults function', async () => {
      const header = {
        key: 'searchGetTracks',
        data: {}
      }
      const data = {
        tracks: {
          limit: 10,
          offset: 10,
          total: 1,
          items: ['result']
        } as unknown
      }
      expect.assertions(1)
      mockDecorateSearchResults.mockResolvedValue('tracks')
      const returnData = await SearchDecorator.parse(
        header,
        data as SpotifyApi.SearchResponse
      )
      expect(returnData).toEqual({
        limit: 10,
        offset: 10,
        total: 1,
        tracks: 'tracks'
      })
    })
  })
})

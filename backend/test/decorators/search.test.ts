import DecorateSearchResults from '../../src/decorators/result'
import SearchDecorator from '../../src/decorators/search'
jest.mock('../../src/decorators/result')

const mockDecorateSearchResults = DecorateSearchResults as jest.Mock

describe('SearchDecorator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle skipping', () => {
    expect.assertions(1)
    const header = {
      key: 'keynotused',
      data: {}
    }
    const data = {}

    return SearchDecorator.parse(header, data).then((results) => {
      expect(results).toEqual('skippedSearchDecoratorDecoration: keynotused')
    })
  })

  describe('SEARCH_GET_TRACKS', () => {
    it('calls the DecorateSearchResults function', () => {
      const header = {
        key: 'searchGetTracks',
        data: {}
      }
      const data = {
        tracks: {
          items: ['result']
        }
      }
      expect.assertions(1)
      mockDecorateSearchResults.mockResolvedValue('tracks')
      return SearchDecorator.parse(header, data).then((returnData) => {
        expect(returnData).toEqual({ tracks: { items: 'tracks' } })
      })
    })
  })
})

import DecorateSearchResults from 'decorators/search/results'
import SearchDecorator from './index'
jest.mock('decorators/search/results')

describe('SearchDecorator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle skipping', () => {
    expect.assertions(1)
    const header = { key: 'keynotused' }
    const data = {}

    return SearchDecorator.parse(header, data).then((results) => {
      expect(results).toEqual('skippedSearchDecoratorDecoration: keynotused')
    })
  })

  it('should handle SEARCH_GET_TRACKS', () => {
    expect.assertions(1)
    const header = { key: 'searchGetTracks' }
    const data = {
      tracks: {
        items: ['result']
      }
    }
    DecorateSearchResults.mockImplementation(() => ['result1', 'result2'])

    return SearchDecorator.parse(header, data).then((results) => {
      expect(results).toEqual({ tracks: { items: ['result1', 'result2'] } })
    })
  })
})

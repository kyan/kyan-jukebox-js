import { expect, test, beforeEach, describe, mock, afterEach } from 'bun:test'
import SearchDecorator from '../../src/decorators/search'

// Mock the DecorateSearchResults module
const mockDecorateSearchResults = mock()
mock.module('../../src/decorators/result', () => ({
  default: mockDecorateSearchResults
}))

describe('SearchDecorator', () => {
  beforeEach(() => {
    mockDecorateSearchResults.mockClear()
  })

  afterEach(() => {
    // Restore the original module after each test
    mock.restore()
  })

  test('should handle skipping', async () => {
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
    test('calls the DecorateSearchResults function', async () => {
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
      mockDecorateSearchResults.mockResolvedValue([])
      const returnData = await SearchDecorator.parse(
        header,
        data as SpotifyApi.SearchResponse
      )
      expect(returnData).toEqual({
        limit: 10,
        offset: 10,
        total: 1,
        tracks: []
      })
    })
  })
})

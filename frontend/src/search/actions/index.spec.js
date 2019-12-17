import * as actions from './index'
import Search from 'search/constants'

describe('actions', () => {
  it('should handle TOGGLE_SEARCH_SIDEBAR', () => {
    const expectedAction = {
      type: Search.TOGGLE_SEARCH_SIDEBAR,
      open: true
    }
    expect(actions.toggleSearchSidebar(true)).toEqual(expectedAction)
  })

  it('should handle STORE_SEARCH_RESULTS', () => {
    const expectedAction = {
      type: Search.STORE_SEARCH_RESULTS,
      results: 'results'
    }
    expect(actions.storeSearchResults('results')).toEqual(expectedAction)
  })

  it('should handle STORE_SEARCH_QUERY', () => {
    const expectedAction = {
      type: Search.STORE_SEARCH_QUERY,
      query: 'query'
    }
    expect(actions.storeSearchQuery('query')).toEqual(expectedAction)
  })

  it('should handle SEARCH_GET_TRACKS', () => {
    const options = { options: 'options' }
    const expectedAction = {
      type: Search.SEARCH,
      key: Search.SEARCH_GET_TRACKS,
      params: {
        query: 'query',
        options: options
      }
    }
    expect(actions.search('query', options)).toEqual(expectedAction)
  })

  it('should handle STORE_SEARCH_QUERY', () => {
    const expectedAction = {
      type: Search.REMOVE_FROM_SEARCH_RESULTS,
      uri: 'uri'
    }
    expect(actions.removeFromSearchResults('uri')).toEqual(expectedAction)
  })
})

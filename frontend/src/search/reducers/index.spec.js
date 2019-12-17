import reducer from './index'
import Constant from 'search/constants'

describe('search', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      searchSideBarOpen: false,
      query: '',
      limit: 20,
      offset: 0,
      total: 0,
      results: []
    })
  })

  it('handles REMOVE_FROM_SEARCH_RESULTS', () => {
    const results = [
      { track: { uri: 'url1' } },
      { track: { uri: 'url2' } },
      { track: { uri: 'url3' } }
    ]
    expect(reducer({ results: results }, {
      type: Constant.REMOVE_FROM_SEARCH_RESULTS,
      uri: 'url2'
    })).toEqual({
      results: [
        { track: { uri: 'url1' } },
        { track: { uri: 'url3' } }
      ]
    })
  })

  it('handles TOGGLE_SEARCH_SIDEBAR', () => {
    expect(reducer({ searchSideBarOpen: false }, {
      type: Constant.TOGGLE_SEARCH_SIDEBAR,
      open: true
    })).toEqual({
      searchSideBarOpen: true
    })
  })

  it('handles STORE_SEARCH_QUERY', () => {
    expect(reducer({ query: '' }, {
      type: Constant.STORE_SEARCH_QUERY,
      query: 'query'
    })).toEqual({
      query: 'query'
    })
  })

  it('handles STORE_SEARCH_RESULTS', () => {
    const tracks = [
      { track: { uri: 'url1' } },
      { track: { uri: 'url2' } },
      { track: { uri: 'url3' } }
    ]
    expect(reducer(undefined, {
      type: Constant.STORE_SEARCH_RESULTS,
      results: {
        tracks: {
          limit: 10,
          offset: 30,
          total: 3000,
          items: tracks
        }
      }
    })).toEqual({
      limit: 10,
      offset: 30,
      query: '',
      results: tracks,
      searchSideBarOpen: false,
      total: 3000
    })
  })

  it('handles STORE_SEARCH_RESULTS with over 10000 results', () => {
    const tracks = [
      { track: { uri: 'url1' } },
      { track: { uri: 'url2' } },
      { track: { uri: 'url3' } }
    ]
    expect(reducer(undefined, {
      type: Constant.STORE_SEARCH_RESULTS,
      results: {
        tracks: {
          limit: 10,
          offset: 30,
          total: 30000,
          items: tracks
        }
      }
    })).toEqual({
      limit: 10,
      offset: 30,
      query: '',
      results: tracks,
      searchSideBarOpen: false,
      total: 10000
    })
  })
})

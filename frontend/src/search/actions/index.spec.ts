import * as actions from './index'
import Search from 'search/constants'

describe('actions', () => {
  test('TOGGLE_SEARCH_SIDEBAR', () => {
    const expectedAction = {
      type: Search.TOGGLE_SEARCH_SIDEBAR,
      open: true
    }
    expect(actions.toggleSearchSidebar(true)).toEqual(expectedAction)
  })

  test('STORE_SEARCH_RESULTS', () => {
    const expectedAction = {
      type: Search.STORE_SEARCH_RESULTS,
      results: ['results']
    }
    expect(actions.storeSearchResults(['results'])).toEqual(expectedAction)
  })

  test('STORE_SEARCH_QUERY', () => {
    const expectedAction = {
      type: Search.STORE_SEARCH_QUERY,
      query: 'uri'
    }
    expect(actions.storeSearchQuery('uri')).toEqual(expectedAction)
  })

  test('SEARCH_GET_TRACKS', () => {
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

  test('REMOVE_FROM_SEARCH_RESULTS', () => {
    const expectedAction = {
      type: Search.REMOVE_FROM_SEARCH_RESULTS,
      uris: ['uri']
    }
    expect(actions.removeFromSearchResults(['uri'])).toEqual(expectedAction)
  })

  test('ADD_TRACK_TO_MIX', () => {
    const expectedAction = {
      type: Search.ADD_TRACK_TO_MIX,
      track: 'track'
    }
    expect(actions.addTrackToMix('track')).toEqual(expectedAction)
  })

  test('REMOVE_TRACK_FROM_MIX', () => {
    const expectedAction = {
      type: Search.REMOVE_TRACK_FROM_MIX,
      uri: 'uri1'
    }
    expect(actions.removeFromMix('uri1')).toEqual(expectedAction)
  })

  test('SWAP_TRACKS', () => {
    const expectedAction = {
      type: Search.SWAP_TRACKS,
      a: 1,
      b: 3
    }
    expect(actions.swapTracks(1, 3)).toEqual(expectedAction)
  })

  test('CLEAR_MIX', () => {
    const expectedAction = {
      type: Search.CLEAR_MIX
    }
    expect(actions.clearMix()).toEqual(expectedAction)
  })
})

import * as actions from './index'
import Search from 'search/constants'
import { describe, it, expect } from 'bun:test'

describe('actions', () => {
  it('TOGGLE_SEARCH_SIDEBAR', () => {
    const expectedAction = {
      type: Search.TOGGLE_SEARCH_SIDEBAR,
      open: true
    }
    expect(actions.toggleSearchSidebar(true)).toEqual(expectedAction)
  })

  it('STORE_SEARCH_RESULTS', () => {
    const expectedAction = {
      type: Search.STORE_SEARCH_RESULTS,
      results: ['results']
    }
    expect(actions.storeSearchResults(['results'])).toEqual(expectedAction)
  })

  it('STORE_SEARCH_QUERY', () => {
    const expectedAction = {
      type: Search.STORE_SEARCH_QUERY,
      query: 'uri'
    }
    expect(actions.storeSearchQuery('uri')).toEqual(expectedAction)
  })

  it('SEARCH_GET_TRACKS', () => {
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

  it('REMOVE_FROM_SEARCH_RESULTS', () => {
    const expectedAction = {
      type: Search.REMOVE_FROM_SEARCH_RESULTS,
      uris: ['uri']
    }
    expect(actions.removeFromSearchResults(['uri'])).toEqual(expectedAction)
  })

  it('ADD_TRACK_TO_MIX', () => {
    const expectedAction = {
      type: Search.ADD_TRACK_TO_MIX,
      track: 'track'
    }
    expect(actions.addTrackToMix('track')).toEqual(expectedAction)
  })

  it('REMOVE_TRACK_FROM_MIX', () => {
    const expectedAction = {
      type: Search.REMOVE_TRACK_FROM_MIX,
      uri: 'uri1'
    }
    expect(actions.removeFromMix('uri1')).toEqual(expectedAction)
  })

  it('SWAP_TRACKS', () => {
    const expectedAction = {
      type: Search.SWAP_TRACKS,
      a: 1,
      b: 3
    }
    expect(actions.swapTracks(1, 3)).toEqual(expectedAction)
  })

  it('CLEAR_MIX', () => {
    const expectedAction = {
      type: Search.CLEAR_MIX
    }
    expect(actions.clearMix()).toEqual(expectedAction)
  })
})

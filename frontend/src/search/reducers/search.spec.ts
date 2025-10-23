import reducer, { SearchState } from './search'
import Constant from 'search/constants'
import { describe, it, expect } from 'bun:test'

const getInitialState = (initial?: Partial<SearchState>): any =>
  reducer(initial as SearchState, {} as any)

describe('search', () => {
  it('handles initial state', () => {
    const initialState = getInitialState()
    expect(initialState).toMatchSnapshot()
  })

  it('handles REMOVE_FROM_SEARCH_RESULTS', () => {
    const initialState = getInitialState({
      results: [{ uri: 'url1' }, { uri: 'url2' }, { uri: 'url3' }]
    })
    expect(initialState.results).toHaveLength(3)
    const state = reducer(initialState, {
      type: Constant.REMOVE_FROM_SEARCH_RESULTS,
      uris: ['url2']
    })
    expect(state.results).toHaveLength(2)
    expect(state.results[0].uri).toEqual('url1')
  })

  it('handles TOGGLE_SEARCH_SIDEBAR', () => {
    const initialState = getInitialState()
    const state = reducer(initialState, {
      type: Constant.TOGGLE_SEARCH_SIDEBAR,
      open: true
    })
    expect(state.searchSideBarOpen).toBeTruthy()
  })

  it('handles STORE_SEARCH_QUERY', () => {
    const initialState = getInitialState()
    const state = reducer(initialState, {
      type: Constant.STORE_SEARCH_QUERY,
      query: 'query'
    })
    expect(state.query).toEqual('query')
  })

  it('handles STORE_SEARCH_RESULTS', () => {
    const tracks = [{ uri: 'url1' }, { uri: 'url2' }, { uri: 'url3' }]
    const initialState = getInitialState()
    expect(initialState.results).toHaveLength(0)
    const state = reducer(initialState, {
      type: Constant.STORE_SEARCH_RESULTS,
      results: {
        limit: 0,
        offset: 0,
        total: 3,
        tracks
      }
    })
    expect(state.results).toHaveLength(3)
    expect(state.offset).toEqual(0)
    expect(state.total).toEqual(3)
  })

  it('handles STORE_SEARCH_RESULTS of > 30000', () => {
    const tracks = [{ uri: 'url1' }, { uri: 'url2' }, { uri: 'url3' }]
    const initialState = getInitialState()
    expect(initialState.results).toHaveLength(0)
    const state = reducer(initialState, {
      type: Constant.STORE_SEARCH_RESULTS,
      results: {
        limit: 0,
        offset: 0,
        total: 30000,
        tracks
      }
    })
    expect(state.results).toHaveLength(3)
    expect(state.offset).toEqual(0)
    expect(state.total).toEqual(10000)
  })
})

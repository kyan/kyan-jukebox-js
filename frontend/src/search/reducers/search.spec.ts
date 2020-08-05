import reducer, { SearchState } from './search'
import Constant from 'search/constants'

const getInitialState = (initial?: Partial<SearchState>): any =>
  reducer(initial as SearchState, {} as any)

describe('search', () => {
  it('handles initial state', () => {
    const initialState = getInitialState()
    expect(initialState).toMatchSnapshot()
  })

  it('handles REMOVE_FROM_SEARCH_RESULTS', () => {
    const initialState = getInitialState({
      results: [{ track: { uri: 'url1' } }, { track: { uri: 'url2' } }, { track: { uri: 'url3' } }]
    })
    expect(initialState.results).toHaveLength(3)
    const state = reducer(initialState, {
      type: Constant.REMOVE_FROM_SEARCH_RESULTS,
      uris: ['url2']
    })
    expect(state.results).toHaveLength(2)
    expect(state.results[0].track.uri).toEqual('url1')
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
    const tracks = [
      { track: { uri: 'url1' } },
      { track: { uri: 'url2' } },
      { track: { uri: 'url3' } }
    ]
    const initialState = getInitialState()
    expect(initialState.results).toHaveLength(0)
    const state = reducer(initialState, {
      type: Constant.STORE_SEARCH_RESULTS,
      results: {
        tracks: {
          offset: 0,
          total: 3,
          items: tracks
        }
      }
    })
    expect(state.results).toHaveLength(3)
    expect(state.offset).toEqual(0)
    expect(state.total).toEqual(3)
  })

  it('handles STORE_SEARCH_RESULTS of > 30000', () => {
    const tracks = [
      { track: { uri: 'url1' } },
      { track: { uri: 'url2' } },
      { track: { uri: 'url3' } }
    ]
    const initialState = getInitialState()
    expect(initialState.results).toHaveLength(0)
    const state = reducer(initialState, {
      type: Constant.STORE_SEARCH_RESULTS,
      results: {
        tracks: {
          offset: 0,
          total: 30000,
          items: tracks
        }
      }
    })
    expect(state.results).toHaveLength(3)
    expect(state.offset).toEqual(0)
    expect(state.total).toEqual(10000)
  })
})

import { Reducer } from 'redux'
import Constant from 'search/constants'

export type SearchState = Readonly<{
  searchSideBarOpen: boolean
  query: string
  limit: number
  offset: number
  total: number
  results: ReadonlyArray<any>
}>

const initalState: SearchState = {
  searchSideBarOpen: false,
  query: '',
  limit: 20,
  offset: 0,
  total: 0,
  results: []
}

const search: Reducer<SearchState> = (state = initalState, action) => {
  switch (action.type) {
    case Constant.REMOVE_FROM_SEARCH_RESULTS: {
      return {
        ...state,
        results: state.results.filter(track => {
          return !action.uris.includes(track.uri)
        })
      }
    }
    case Constant.TOGGLE_SEARCH_SIDEBAR: {
      return Object.assign({}, state, {
        searchSideBarOpen: action.open
      })
    }
    case Constant.STORE_SEARCH_QUERY: {
      return Object.assign({}, state, {
        query: action.query
      })
    }
    case Constant.STORE_SEARCH_RESULTS: {
      return Object.assign({}, state, {
        limit: action.results.limit,
        offset: action.results.offset,
        total: action.results.total > 10000 ? 10000 : action.results.total,
        results: action.results.tracks
      })
    }
    default: {
      return state
    }
  }
}

export default search

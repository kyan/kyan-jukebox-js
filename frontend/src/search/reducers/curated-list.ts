import { Reducer } from 'redux'
import Constant from 'search/constants'

export type CurateState = Readonly<{
  tracks: any[]
}>

const initalState: CurateState = {
  tracks: []
}

const curate: Reducer<CurateState> = (state = initalState, action) => {
  switch (action.type) {
    case Constant.ADD_TRACK_TO_MIX: {
      const exists = state.tracks.find(track => track.uri === action.track.uri)
      if (!exists) state.tracks.push(action.track)

      return state
    }
    case Constant.REMOVE_TRACK_FROM_MIX: {
      return {
        ...state,
        tracks: state.tracks.filter(track => track.uri !== action.uri)
      }
    }
    case Constant.SWAP_TRACKS: {
      const list = state.tracks
      list[action.a] = list.splice(action.b, 1, list[action.a])[0]

      return {
        ...state,
        tracks: list
      }
    }
    case Constant.CLEAR_MIX: {
      return {
        ...state,
        tracks: []
      }
    }
    default: {
      return state
    }
  }
}

export default curate

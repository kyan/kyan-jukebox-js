import reducer, { CurateState } from './curated-list'
import Constant from 'search/constants'
import { describe, it, expect } from 'bun:test'

const getInitialState = (initial?: Partial<CurateState>) =>
  reducer(initial as CurateState, {} as any)

describe('curated-list', () => {
  it('initial state is correct', () => {
    const initialState = getInitialState()
    expect(initialState).toMatchSnapshot()
  })

  it('ADD_TRACK_TO_MIX', () => {
    const initialState = getInitialState()
    expect(initialState.tracks).toHaveLength(0)
    const state = reducer(initialState, {
      type: Constant.ADD_TRACK_TO_MIX,
      track: { uri: '123' }
    })
    expect(state.tracks).toHaveLength(1)
  })

  it('REMOVE_TRACK_FROM_MIX', () => {
    const initialState = getInitialState({
      tracks: [{ uri: '123' }]
    })
    expect(initialState.tracks).toHaveLength(1)
    const state = reducer(initialState, {
      type: Constant.REMOVE_TRACK_FROM_MIX,
      uri: '123'
    })
    expect(state.tracks).toHaveLength(0)
  })

  it('ADD_TRACK_TO_MIX does not add items that exist', () => {
    const initialState = getInitialState({
      tracks: [{ uri: '123' }, { uri: '456' }]
    })
    expect(initialState.tracks).toHaveLength(2)
    const state = reducer(initialState, {
      type: Constant.ADD_TRACK_TO_MIX,
      track: { uri: '123' }
    })
    expect(state.tracks).toHaveLength(2)
  })

  it('SWAP_TRACKS', () => {
    const initialState = getInitialState({
      tracks: [{ uri: '123' }, { uri: '456' }, { uri: '789' }]
    })
    expect(initialState.tracks[0].uri).toEqual('123')
    expect(initialState.tracks[2].uri).toEqual('789')
    const state = reducer(initialState, {
      type: Constant.SWAP_TRACKS,
      a: 0,
      b: 2
    })
    expect(state.tracks[0].uri).toEqual('789')
    expect(state.tracks[2].uri).toEqual('123')
  })

  it('CLEAR_MIX', () => {
    const initialState = getInitialState({
      tracks: [{ uri: '123' }, { uri: '456' }, { uri: '789' }]
    })
    expect(initialState.tracks).toHaveLength(3)
    const state = reducer(initialState, {
      type: Constant.CLEAR_MIX
    })
    expect(state.tracks).toHaveLength(0)
  })
})

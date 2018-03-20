import reducer from './index'
import Types from '../../constants'
import notify from '../../utils/notify'
jest.mock('../../utils/notify')

describe('jukebox', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      volume: 0,
      online: false,
      playbackState: 'paused'
    })
  })

  it('handles a CONNECTED', () => {
    expect(reducer(undefined, {
      type: Types.CONNECTED
    })).toEqual({
      volume: 0,
      online: true,
      playbackState: 'paused'
    })
  })

  it('handles a DISCONNECTED', () => {
    expect(reducer({ online: true }, {
      type: Types.DISCONNECTED
    })).toEqual({ online: false })
  })

  it('handles a UPDATE_VOLUME', () => {
    expect(reducer(undefined, {
      type: Types.UPDATE_VOLUME,
      volume: 32
    })).toEqual({
      volume: 32,
      online: false,
      playbackState: 'paused'
    })
  })

  it('handles a UPDATE_VOLUME increased', () => {
    const state = {
      volume: 10,
      online: false
    }
    expect(reducer(state, {
      type: Types.UPDATE_VOLUME,
      volume: 32
    })).toEqual({
      volume: 32,
      online: false
    })
  })

  it('handles a UPDATE_VOLUME decreased', () => {
    const state = {
      volume: 10,
      online: false
    }
    expect(reducer(state, {
      type: Types.UPDATE_VOLUME,
      volume: 5
    })).toEqual({
      volume: 5,
      online: false
    })
  })

  it('handles a UPDATE_PLAYBACK_STATE playing', () => {
    expect(reducer(undefined, {
      type: Types.UPDATE_PLAYBACK_STATE,
      state: 'playing'
    })).toEqual({
      playbackState: 'playing',
      volume: 0,
      online: false
    })
    expect(notify.mock.calls.length).toEqual(1)
    expect(notify.mock.calls[0][0]).toEqual('Jukebox playing')
    notify.mockClear()
  })

  it('handles a UPDATE_PLAYBACK_STATE playing when already playing', () => {
    const state = {
      playbackState: 'playing',
      online: false,
      volume: 0
    }
    expect(reducer(state, {
      type: Types.UPDATE_PLAYBACK_STATE,
      state: 'playing'
    })).toEqual({
      playbackState: 'playing',
      volume: 0,
      online: false
    })
    expect(notify.mock.calls.length).toEqual(0)
    notify.mockClear()
  })
})

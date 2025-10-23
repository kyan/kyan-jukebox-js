import reducer from './index'
import Types from 'constants/common'
import { describe, it, expect } from 'bun:test'

describe('jukebox', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot()
  })

  it('handles a CONNECTED', () => {
    expect(
      reducer(undefined, {
        type: Types.CONNECTED
      })
    ).toMatchSnapshot()
  })

  it('handles a MOPIDY_CONNECTED', () => {
    expect(
      reducer(undefined, {
        type: Types.MOPIDY_CONNECTED
      })
    ).toMatchSnapshot()
  })

  it('handles a DISCONNECTED', () => {
    expect(
      reducer(
        { online: true },
        {
          type: Types.DISCONNECTED
        }
      )
    ).toMatchSnapshot()
  })

  it('handles a MOPIDY_DISCONNECTED', () => {
    expect(
      reducer(
        { mopidyOnline: true },
        {
          type: Types.MOPIDY_DISCONNECTED
        }
      )
    ).toMatchSnapshot()
  })

  it('handles a UPDATE_VOLUME', () => {
    expect(
      reducer(undefined, {
        type: Types.UPDATE_VOLUME,
        volume: 32
      })
    ).toMatchSnapshot()
  })

  it('handles a UPDATE_VOLUME increased', () => {
    const state = {
      volume: 10,
      online: false
    }
    expect(
      reducer(state, {
        type: Types.UPDATE_VOLUME,
        volume: 32
      })
    ).toMatchSnapshot()
  })

  it('handles a UPDATE_VOLUME decreased', () => {
    const state = {
      volume: 10,
      online: false
    }
    expect(
      reducer(state, {
        type: Types.UPDATE_VOLUME,
        volume: 5
      })
    ).toMatchSnapshot()
  })

  it('handles a UPDATE_PLAYBACK_STATE playing', () => {
    expect(
      reducer(undefined, {
        type: Types.UPDATE_PLAYBACK_STATE,
        state: 'playing'
      })
    ).toMatchSnapshot()
  })

  it('handles a UPDATE_PLAYBACK_STATE playing when already playing', () => {
    const state = {
      playbackState: 'playing',
      online: false,
      volume: 0
    }
    expect(
      reducer(state, {
        type: Types.UPDATE_PLAYBACK_STATE,
        state: 'playing'
      })
    ).toMatchSnapshot()
  })
})

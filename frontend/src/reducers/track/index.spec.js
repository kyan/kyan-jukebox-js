import reducer from './index'
import Types from 'constants/common'
import { describe, it, expect } from 'bun:test'

describe('track', () => {
  const track1 = {
    uri: 't1',
    name: 'track1',
    artist: { name: 'artist1' },
    album: { name: 'album1' },
    addedBy: null,
    metrics: null
  }

  describe('ADD_CURRENT_TRACK', () => {
    it('handles default state', () => {
      expect(reducer(undefined, {})).toBeNull()
    })

    it('handles a track', () => {
      expect(reducer(null, { type: Types.ADD_CURRENT_TRACK, track: track1 })).toMatchSnapshot()
    })
  })

  describe('SYNC_SOCIAL_DATA', () => {
    it('handles no change', () => {
      expect(
        reducer(track1, { type: Types.SYNC_SOCIAL_DATA, track: { uri: 'no-change' } })
      ).toMatchSnapshot()
    })

    it('handles a change', () => {
      expect(
        reducer(track1, {
          type: Types.SYNC_SOCIAL_DATA,
          track: { uri: 't2', addedBy: 'duncan', metrics: 'metrics' }
        })
      ).toMatchSnapshot()
    })
  })
})

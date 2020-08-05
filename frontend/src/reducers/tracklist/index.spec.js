import reducer from './index'
import Types from 'constants/common'

describe('tracklist', () => {
  const track1 = {
    uri: 't1',
    name: 'track1',
    artist: { name: 'artist1' },
    album: { name: 'album1' },
    addedBy: null,
    metrics: null
  }
  const track2 = {
    uri: 't2',
    name: 'track2',
    artist: { name: 'artist2' },
    album: { name: 'album2' },
    addedBy: null,
    metrics: null
  }
  const track3 = {
    uri: 't3',
    name: 'track3',
    artist: { name: 'artist3' },
    composer: { name: 'composer3' },
    addedBy: null,
    metrics: null
  }

  describe('ADD_TRACKS', () => {
    it('handles default state', () => {
      expect(reducer(undefined, {})).toMatchSnapshot()
    })

    it('handles empty tracklist', () => {
      const tracks = [{ track: track1 }]
      expect(reducer([], { type: Types.ADD_TRACKS, list: tracks })).toMatchSnapshot()
    })

    it('handles when some new tracks added', () => {
      const tracks = [{ track: track2 }, { track: track3 }]
      expect(reducer([track1], { type: Types.ADD_TRACKS, list: tracks })).toMatchSnapshot()
    })

    it('handles when some tracks removed', () => {
      const tracks = [{ track: track2 }, { track: track3 }]
      expect(
        reducer([track1, track2, track3], { type: Types.ADD_TRACKS, list: tracks })
      ).toMatchSnapshot()
    })
  })

  describe('SYNC_SOCIAL_DATA', () => {
    it('handles no change', () => {
      const tracks = [track1]
      expect(
        reducer(tracks, { type: Types.SYNC_SOCIAL_DATA, track: { uri: 'no-change' } })
      ).toMatchSnapshot()
    })

    it('handles a change', () => {
      const tracks = [track2, track3]
      expect(
        reducer(tracks, {
          type: Types.SYNC_SOCIAL_DATA,
          track: { uri: 't2', addedBy: 'duncan', metrics: 'metrics' }
        })
      ).toMatchSnapshot()
    })
  })
})

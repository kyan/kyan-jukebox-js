import reducer from './index'
import notify from '../../utils/notify'
import Types from '../../constants'
jest.mock('../../utils/notify')

describe('tracklist', () => {
  const track1 = {
    uri: 't1',
    name: 'track1',
    artist: { name: 'artist1' },
    album: { name: 'album1' }
  }
  const track2 = {
    uri: 't2',
    name: 'track2',
    artist: { name: 'artist2' },
    album: { name: 'album2' }
  }
  const track3 = {
    uri: 't3',
    name: 'track3',
    artist: { name: 'artist3' },
    composer: { name: 'composer3' }
  }

  describe('ADD_TRACKS', () => {
    it('handles default state', () => {
      expect(reducer(undefined, {})).toEqual([])
      expect(notify.mock.calls.length).toEqual(0)
    })

    it('handles empty tracklist', () => {
      const tracks = [{track: track1}]
      expect(reducer([], { type: Types.ADD_TRACKS, list: tracks }))
        .toEqual([track1])
    })

    it('handles when some new tracks added', () => {
      const tracks = [{track: track2}, {track: track3}]
      expect(reducer([track1], { type: Types.ADD_TRACKS, list: tracks }))
        .toEqual([track2, track3])
      expect(notify.mock.calls.length).toEqual(2)
      expect(notify.mock.calls[0][0]).toEqual('Added track2 by artist2')
      expect(notify.mock.calls[1][0]).toEqual('Added track3 by artist3')
      notify.mockClear()
    })

    it('handles when some tracks removed', () => {
      const tracks = [{track: track2}, {track: track3}]
      expect(reducer([track1, track2, track3], { type: Types.ADD_TRACKS, list: tracks }))
        .toEqual([track2, track3])
      expect(notify.mock.calls.length).toEqual(0)
    })
  })
})

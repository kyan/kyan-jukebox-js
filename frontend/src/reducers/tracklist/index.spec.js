import reducer from './index'
import Types from '../../constants'

describe('tracklist', () => {
  const cache = [
    { ref: 'spotify:track:0c41pMosF5Kqwwegcps8ES' },
    { ref: 'spotify:track:0c41pMosF5Kqwweg123455', uri: 'path/to/file' }
  ]

  describe('ADD_TRACKS', () => {
    it('handles default state', () => {
      expect(reducer(undefined, {})).toEqual([])
    })

    it('handles some tracks', () => {
      const tracks = [
        { track: 'track1' },
        { track: 'track2' }
      ]
      expect(reducer([], { type: Types.ADD_TRACKS, list: tracks }))
        .toEqual(['track1', 'track2'])
    })
  })
})

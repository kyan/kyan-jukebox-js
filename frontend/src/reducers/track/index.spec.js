import reducer from './index'
import Types from '../../constants'

describe('track', () => {
  const cache = [
    { ref: 'spotify:track:0c41pMosF5Kqwwegcps8ES' },
    { ref: 'spotify:track:0c41pMosF5Kqwweg123455', uri: 'path/to/file' }
  ]

  describe('ADD_CURRENT_TRACK', () => {
    it('handles default state', () => {
      expect(reducer(undefined, {})).toBeNull()
    })

    it('handles a track', () => {
      const track = 'track'
      expect(reducer([], { type: Types.ADD_CURRENT_TRACK, track }))
        .toEqual('track')
    })
  })
})

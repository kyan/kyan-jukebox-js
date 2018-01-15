import reducer from './index'
import Types from '../../constants'

describe('tracklist', () => {
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

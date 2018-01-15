import reducer from './index'
import Types from '../../constants'

describe('track', () => {
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

import reducer from './index'
import Types from 'constants/common'

describe('timer', () => {
  describe('UPDATE_PROGRESS_TIMER', () => {
    it('handles default state', () => {
      expect(reducer(undefined, {})).toEqual({ 'duration': 0, 'position': 0, 'remaining': 0 })
    })

    it('handles a progress update', () => {
      expect(reducer(undefined, {
        type: Types.UPDATE_PROGRESS_TIMER,
        position: 100,
        duration: 500
      })).toEqual({ 'duration': 500, 'position': 100, 'remaining': 400 })
    })
  })
})

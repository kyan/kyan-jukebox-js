import reducer from './index'
import Types from '../../constants'

describe('settings', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      uid: undefined
    })
  })

  it('handles a STORE_UID', () => {
    expect(reducer(undefined, {
      type: Types.STORE_UID,
      uid: 99
    })).toEqual({
      uid: 99
    })
  })
})

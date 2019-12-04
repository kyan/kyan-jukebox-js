import reducer from './index'
import Types from 'constants/common'

describe('settings', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null
    })
  })

  it('handles STORE_TOKEN', () => {
    expect(reducer(undefined, {
      type: Types.STORE_TOKEN,
      token: 'atoken'
    })).toEqual({
      token: 'atoken'
    })
  })

  it('handles STORE_TOKEN with same value', () => {
    expect(reducer({ token: '1234' }, {
      type: Types.STORE_TOKEN,
      token: '1234'
    })).toEqual({
      token: '1234'
    })
  })

  it('handles CLEAR_STORE_TOKEN', () => {
    expect(reducer({ token: '1234' }, {
      type: Types.CLEAR_STORE_TOKEN
    })).toEqual({
      token: null
    })
  })
})

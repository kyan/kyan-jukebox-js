import reducer from './index'
import Types from 'constants/common'

describe('settings', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null,
      tokenExpires: 0
    })
  })

  it('handles STORE_TOKEN', () => {
    expect(
      reducer(undefined, {
        type: Types.STORE_TOKEN,
        token: 'atoken',
        tokenExpires: 12345
      })
    ).toEqual({
      tokenExpires: 12345,
      token: 'atoken'
    })
  })

  it('handles STORE_TOKEN with same value', () => {
    expect(
      reducer(
        { token: '1234', tokenExpires: 12345 },
        {
          type: Types.STORE_TOKEN,
          token: '1234',
          tokenExpires: 98765
        }
      )
    ).toEqual({
      tokenExpires: 12345,
      token: '1234'
    })
  })

  it('handles CLEAR_STORE_TOKEN', () => {
    expect(
      reducer(
        { token: '1234', tokenExpires: 12345 },
        {
          type: Types.CLEAR_STORE_TOKEN
        }
      )
    ).toEqual({
      token: null,
      tokenExpires: 0
    })
  })
})

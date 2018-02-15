import reducer from './index'
import Types from '../../constants'

describe('settings', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      uid: undefined,
      authorised: false,
      open: false
    })
  })

  it('handles STORE_UID', () => {
    expect(reducer(undefined, {
      type: Types.STORE_UID,
      uid: 99
    })).toEqual({
      authorised: false,
      open: false,
      uid: 99
    })
  })

  it('handles TOGGLE_SETTINGS when default', () => {
    expect(reducer(undefined, {
      type: Types.TOGGLE_SETTINGS
    })).toEqual({
      authorised: false,
      open: true,
      uid: undefined
    })
  })

  it('handles TOGGLE_SETTINGS when true', () => {
    const initial = {
      uid: 123,
      authorised: false,
      open: true
    }
    expect(reducer(initial, {
      type: Types.TOGGLE_SETTINGS
    })).toEqual({
      uid: 123,
      authorised: false,
      open: false
    })
  })
})

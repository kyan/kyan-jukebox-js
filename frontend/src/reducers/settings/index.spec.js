import reducer from './index'
import Types from '../../constants'

describe('settings', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      token: null,
      username: '',
      user: {},
      open: false
    })
  })

  it('handles STORE_TOKEN', () => {
    expect(reducer(undefined, {
      type: Types.STORE_TOKEN,
      token: 'atoken'
    })).toEqual({
      open: false,
      token: 'atoken',
      user: {},
      username: ''
    })
  })

  it('handles STORE_USERNAME', () => {
    expect(reducer(undefined, {
      type: Types.STORE_USERNAME,
      username: 'user123'
    })).toEqual({
      open: false,
      token: null,
      user: {},
      username: 'user123'
    })
  })

  describe('handles STORE_USER', () => {
    it('handles hashing an email', () => {
      expect(reducer(undefined, {
        type: Types.STORE_USER,
        user: { username: 'xxx', email: 'foo@bar.com' }
      })).toEqual({
        open: false,
        token: null,
        user: {
          email: 'foo@bar.com',
          emailHash: 'f3ada405ce890b6f8204094deb12d8a8',
          username: 'xxx'
        },
        username: 'xxx'
      })
    })

    it('handles not hashing an email', () => {
      expect(reducer(undefined, {
        type: Types.STORE_USER,
        user: { username: 'xxx' }
      })).toEqual({
        open: false,
        token: null,
        user: {
          username: 'xxx'
        },
        username: 'xxx'
      })
    })
  })

  it('handles TOGGLE_SETTINGS when default', () => {
    expect(reducer(undefined, {
      type: Types.TOGGLE_SETTINGS
    })).toEqual({
      open: true,
      token: null,
      user: {},
      username: ''
    })
  })

  it('handles TOGGLE_SETTINGS when true', () => {
    const initial = {
      open: true,
      token: null,
      user: {},
      username: ''
    }
    expect(reducer(initial, {
      type: Types.TOGGLE_SETTINGS
    })).toEqual({
      open: false,
      token: null,
      user: {},
      username: ''
    })
  })
})

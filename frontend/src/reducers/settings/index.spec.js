import reducer from './index'
import Types from 'constants/common'
import { describe, it, expect } from 'bun:test'

describe('settings', () => {
  it('handles default state', () => {
    expect(reducer(undefined, {})).toEqual({
      email: null,
      user: null,
      isSignedIn: false,
      isValidating: false,
      authError: null
    })
  })

  it('handles VALIDATE_USER', () => {
    const email = 'test@example.com'
    const user = { email, fullname: 'Test User' }
    expect(
      reducer(undefined, {
        type: Types.VALIDATE_USER,
        email,
        user
      })
    ).toEqual({
      email: 'test@example.com',
      user: { email: 'test@example.com', fullname: 'Test User' },
      isSignedIn: false,
      isValidating: true,
      authError: null
    })
  })

  it('handles STORE_USER', () => {
    const email = 'test@example.com'
    const user = { email, fullname: 'Test User', picture: 'avatar.jpg' }
    expect(
      reducer(undefined, {
        type: Types.STORE_USER,
        email,
        user
      })
    ).toEqual({
      email: 'test@example.com',
      user: { email: 'test@example.com', fullname: 'Test User', picture: 'avatar.jpg' },
      isSignedIn: true,
      isValidating: false,
      authError: null
    })
  })

  it('handles CLEAR_USER', () => {
    const initialState = {
      email: 'test@example.com',
      user: { email: 'test@example.com', fullname: 'Test User' },
      isSignedIn: true,
      isValidating: false,
      authError: null
    }
    expect(
      reducer(initialState, {
        type: Types.CLEAR_USER
      })
    ).toEqual({
      email: null,
      user: null,
      isSignedIn: false,
      isValidating: false,
      authError: null
    })
  })

  it('handles SET_AUTH_ERROR with error', () => {
    expect(
      reducer(undefined, {
        type: Types.SET_AUTH_ERROR,
        error: 'Invalid credentials'
      })
    ).toEqual({
      email: null,
      user: null,
      isSignedIn: false,
      isValidating: false,
      authError: 'Invalid credentials'
    })
  })

  it('handles SET_AUTH_ERROR clearing error', () => {
    const stateWithError = {
      email: 'test@example.com',
      user: { email: 'test@example.com', fullname: 'Test User' },
      isSignedIn: true,
      isValidating: false,
      authError: 'Previous error'
    }
    expect(
      reducer(stateWithError, {
        type: Types.SET_AUTH_ERROR,
        error: null
      })
    ).toEqual({
      email: 'test@example.com',
      user: { email: 'test@example.com', fullname: 'Test User' },
      isSignedIn: true,
      isValidating: false,
      authError: null
    })
  })
})

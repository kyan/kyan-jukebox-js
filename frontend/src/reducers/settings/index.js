import Types from 'constants/common'

const initalState = {
  email: null,
  user: null,
  isSignedIn: false,
  isValidating: false,
  authError: null
}

const settings = (state = initalState, action) => {
  switch (action.type) {
    case Types.VALIDATE_USER:
      return Object.assign({}, state, {
        email: action.email,
        user: action.user,
        isValidating: true,
        isSignedIn: false,
        authError: null
      })
    case Types.STORE_USER:
      if (action.email === state.email && state.isSignedIn) return state
      return Object.assign({}, state, {
        email: action.email,
        user: action.user,
        isSignedIn: true,
        isValidating: false,
        authError: null
      })
    case Types.CLEAR_USER:
      return initalState
    case Types.SET_AUTH_ERROR:
      // Only clear user if there's an actual error
      if (action.error) {
        return Object.assign({}, state, {
          authError: action.error,
          isSignedIn: false,
          isValidating: false,
          user: null,
          email: null
        })
      }
      // Just clear the error, keep user signed in
      return Object.assign({}, state, {
        authError: null
      })
    default:
      return state
  }
}

export default settings

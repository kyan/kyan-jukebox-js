import Types from 'constants/common'

const initalState = {
  tokenExpires: 0,
  token: null
}

const settings = (state = initalState, action) => {
  switch (action.type) {
    case Types.STORE_TOKEN:
      if (action.token === state.token) return state
      return Object.assign({}, state, {
        token: action.token,
        tokenExpires: action.tokenExpires
      })
    case Types.CLEAR_STORE_TOKEN:
      return initalState
    default:
      return state
  }
}

export default settings

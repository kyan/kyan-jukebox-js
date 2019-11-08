import Types from '../../constants'

const initalState = {
  token: null
}

const settings = (state = initalState, action) => {
  switch (action.type) {
    case Types.STORE_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      })
    case Types.CLEAR_STORE_TOKEN:
      return Object.assign({}, state, {
        token: null
      })
    default:
      return state
  }
}

export default settings

import Types from '../../constants'

const initalState = {
  uid: undefined,
  authorised: false,
  open: false
}

const settings = (state = initalState, action) => {
  switch (action.type) {
    case Types.STORE_UID:
      return Object.assign({}, state, {
        uid: action.uid
      })
    case Types.TOGGLE_SETTINGS:
      return Object.assign({}, state, {
        open: !state.open
      })
    default:
      return state
  }
}

export default settings

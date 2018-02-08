import Types from '../../constants'

const initalState = {
  uid: undefined
}

const settings = (state = initalState, action) => {
  switch (action.type) {
    case Types.STORE_UID:
      return Object.assign({}, state, {
        uid: action.uid
      })
    default:
      return state
  }
}

export default settings

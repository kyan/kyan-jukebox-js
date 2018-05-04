import crypto from 'crypto'
import Types from '../../constants'

const initalState = {
  token: null,
  username: '',
  user: {},
  open: false
}

const md5Email = (user) => {
  if (user.email) {
    user.emailHash = crypto
      .createHash('md5')
      .update(user.email.trim())
      .digest('hex')
  }

  return user
}

const settings = (state = initalState, action) => {
  switch (action.type) {
    case Types.STORE_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      })
    case Types.STORE_USERNAME:
      return Object.assign({}, state, {
        username: action.username
      })
    case Types.STORE_USER:
      const user = md5Email(action.user)
      return Object.assign({}, state, {
        username: user.username,
        user: user
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

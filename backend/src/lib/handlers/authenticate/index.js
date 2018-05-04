import jwt from 'jsonwebtoken'
import AuthConsts from '../../constants/auth'
import MopidyConsts from '../../constants/mopidy'

const isAuthorisedRequest = (key) => {
  return MopidyConsts.AUTHORISED_KEYS.includes(key)
}

const AuthenticateHandler = (payload, ws, broadcaster, cb) => {
  if (!isAuthorisedRequest(payload.encoded_key)) return cb(payload)

  jwt.verify(payload.jwt_token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      err.encoded_key = payload.encoded_key
      payload.encoded_key = AuthConsts.AUTHENTICATION_ERROR
      broadcaster.to(ws, payload, { error: err.message })
      return
    }

    // This denotes payload authenticated. We could
    // of course check the user ID exists in mongodb
    payload.user_id = decoded._id

    return cb(payload)
  })
}

export default AuthenticateHandler

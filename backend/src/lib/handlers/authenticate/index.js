import { OAuth2Client } from 'google-auth-library'
import AuthConsts from 'constants/auth'
import MopidyConsts from 'constants/mopidy'
import logger from 'config/winston'
import User from '../../services/mongodb/models/user'

const isAuthorisedRequest = (key) => {
  return MopidyConsts.AUTHORISED_KEYS.includes(key)
}

const persistUser = (user) => {
  const query = { _id: user._id }
  const update = user
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }
  return User.findOneAndUpdate(query, update, options)
}

const AuthenticateHandler = (payload, ws, broadcaster, moveOn) => {
  if (!isAuthorisedRequest(payload.encoded_key)) return moveOn(payload)
  const token = payload.jwt_token
  const client = new OAuth2Client(process.env.CLIENT_ID)

  client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID })
    .then((ticket) => {
      const data = ticket.getPayload()
      const responsePayload = {
        data: payload.data,
        key: payload.key,
        encoded_key: payload.encoded_key,
        token: token,
        user: {
          _id: data['sub'],
          fullname: data['name']
        }
      }

      if (data['hd'] === 'kyanmedia.com') {
        return persistUser(responsePayload.user)
          .then(() => moveOn(responsePayload))
          .catch((err) => logger.error('Error checking user', { error: err.message }))
      }

      payload.encoded_key = AuthConsts.AUTHENTICATION_TOKEN_INVALID
      broadcaster.to(ws, payload, { error: `Invalid domain: ${data['hd']}` })
    })
    .catch(err => {
      payload.encoded_key = AuthConsts.AUTHENTICATION_TOKEN_INVALID
      broadcaster.to(ws, payload, { error: err.message })
    })
}

export default AuthenticateHandler

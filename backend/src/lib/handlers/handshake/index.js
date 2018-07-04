import jwt from 'jsonwebtoken'
import logger from '../../../config/winston'
import AuthConstants from '../../constants/auth'
import User from '../../services/mongodb/models/user'

const encodeJWT = (data, keys) => {
  let payload = {}
  keys.forEach(k => { payload[k] = data[k] })
  return jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)
}

const logAuthenticationData = (data, payload) => {
  if (data.token) {
    logger.info('Authentication Success', { user: data.user.fullname })
  } else {
    logger.info('Authentication Fail', { user: payload.data.username })
  }

  return null
}

const createData = (data, originalData) => {
  let payload = { token: null, user: {} }
  if (data) payload.user = JSON.parse(JSON.stringify(data))
  if (data) payload.token = encodeJWT(data, ['_id', 'username'])
  logAuthenticationData(payload, originalData)

  return payload
}

const sendToClient = (bc, ws, payload) => {
  return (data) => {
    bc.to(ws, payload, createData(data, payload))
  }
}

const dbCall = (username, responseHandler) => {
  return User.findOne({ username })
    .then(resp => responseHandler(resp))
}

const HandshakeHandler = (payload, ws, broadcaster) => {
  switch (payload.encoded_key) {
    case AuthConstants.AUTHENTICATE_USER:
      dbCall(
        payload.data.username,
        sendToClient(broadcaster, ws, payload)
      )
      break
  }
}

export default HandshakeHandler

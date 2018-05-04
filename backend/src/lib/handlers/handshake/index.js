import jwt from 'jsonwebtoken'
import AuthConstants from '../../constants/auth'
import User from '../../services/mongodb/models/user'

const encodeJWT = (data, keys) => {
  let payload = {}
  keys.forEach(k => { payload[k] = data[k] })
  return jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET)
}

const createData = (data) => {
  let payload = { token: null, user: {} }
  if (data) payload.user = JSON.parse(JSON.stringify(data))
  if (data) payload.token = encodeJWT(data, ['_id', 'username'])

  return payload
}

const sendToClient = (bc, ws, payload) => {
  return (data) => {
    bc.to(ws, payload, createData(data))
  }
}

const dbCall = (query, responseHandler) => {
  return query
    .then(resp => responseHandler(resp))
    .catch(console.error.bind(console))
}

const HandshakeHandler = (payload, ws, broadcaster) => {
  switch (payload.encoded_key) {
    case AuthConstants.AUTHENTICATE_USER:
      dbCall(
        User.findOne({ 'username': payload.data.username }),
        sendToClient(broadcaster, ws, payload)
      )
      break
  }
}

export default HandshakeHandler

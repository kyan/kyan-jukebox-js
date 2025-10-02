import { Socket } from 'socket.io'
import Broadcaster from '../utils/broadcaster'
import AuthConsts from '../constants/auth'
import MopidyConsts from '../constants/mopidy'
import logger from '../config/logger'
import User from '../models/user'
import Payload from '../utils/payload'

const isAuthorisedRequest = (key: string): boolean => {
  return (MopidyConsts.AUTHORISED_KEYS as ReadonlyArray<string>).includes(key)
}

const findUserByEmail = (email: string) => {
  return User.findOne({ email })
}

const AuthenticateHandler = (payload: Payload, socket: Socket): Promise<Payload> => {
  if (!isAuthorisedRequest(payload.key)) {
    return Promise.resolve(payload)
  }

  return new Promise((resolve) => {
    const broadcastTo = (headers: any, message: any): void => {
      Broadcaster.toClient({ socket, headers, message })
    }

    // Check if user data is provided
    if (!payload.user || !payload.user.email) {
      payload.key = AuthConsts.USER_NOT_FOUND
      broadcastTo(payload, { error: 'No user data provided' })
      return
    }

    const { email, fullname, picture } = payload.user

    // Look up user by email
    findUserByEmail(email)
      .then((user) => {
        if (!user) {
          payload.key = AuthConsts.USER_NOT_FOUND
          broadcastTo(payload, { error: `User not found with email: ${email}` })
          return
        }

        // User found, create response payload
        const responsePayload: Payload = {
          data: payload.data,
          key: payload.key,
          user: {
            _id: user._id,
            fullname: fullname || user.fullname,
            picture: picture || user.picture,
            email: user.email
          }
        }

        resolve(responsePayload)
      })
      .catch((err: any) => {
        logger.error('Error looking up user', { error: err.message })
        broadcastTo(payload, { error: err.message })
      })
  })
}

export default AuthenticateHandler

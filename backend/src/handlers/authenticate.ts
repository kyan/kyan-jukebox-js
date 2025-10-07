import { Socket } from 'socket.io'
import Broadcaster from '../utils/broadcaster'
import AuthConsts from '../constants/auth'
import MopidyConsts from '../constants/mopidy'
import logger from '../config/logger'
import { getDatabase } from '../services/database/factory'
import Payload from '../utils/payload'

const isAuthorisedRequest = (key: string): boolean => {
  return (MopidyConsts.AUTHORISED_KEYS as ReadonlyArray<string>).includes(key)
}

const isValidationRequest = (key: string): boolean => {
  return key === MopidyConsts.VALIDATE_USER
}

const findUserByEmail = (email: string) => {
  const db = getDatabase()
  return db.users.findByEmail(email)
}

const AuthenticateHandler = (payload: Payload, socket: Socket): Promise<Payload> => {
  // Skip authentication for non-authorized and non-validation requests
  if (!isAuthorisedRequest(payload.key) && !isValidationRequest(payload.key)) {
    return Promise.resolve(payload)
  }

  return new Promise((resolve) => {
    const broadcastTo = (headers: any, message: any): void => {
      Broadcaster.toClient({ socket, headers, message })
    }

    // Check if user data is provided
    if (!payload.user || !payload.user.email) {
      const errorPayload = {
        key: AuthConsts.USER_NOT_FOUND,
        data: { error: 'No user data provided' },
        user: payload.user
      }
      broadcastTo(errorPayload, { error: 'No user data provided' })
      resolve(errorPayload)
      return
    }

    const { email } = payload.user

    // Look up user by email
    findUserByEmail(email)
      .then((user) => {
        if (!user) {
          const errorPayload = {
            key: AuthConsts.USER_NOT_FOUND,
            data: { error: `User not found with email: ${email}` },
            user: payload.user
          }
          broadcastTo(errorPayload, { error: `User not found with email: ${email}` })
          resolve(errorPayload)
          return
        }

        // User found, create response payload with user data from database
        const responsePayload: Payload = {
          data: isValidationRequest(payload.key)
            ? { success: true, message: 'User validated' }
            : payload.data,
          key: payload.key,
          user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email
          }
        }

        // For validation requests, broadcast success response to client
        if (isValidationRequest(payload.key)) {
          broadcastTo(responsePayload, responsePayload.data)
        }

        resolve(responsePayload)
      })
      .catch((err: any) => {
        logger.error('Error looking up user', { error: err.message })
        const errorPayload = {
          key: AuthConsts.USER_NOT_FOUND,
          data: { error: err.message },
          user: payload.user
        }
        broadcastTo(errorPayload, { error: err.message })
        resolve(errorPayload)
      })
  })
}

export default AuthenticateHandler

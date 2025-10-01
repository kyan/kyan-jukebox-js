import { Socket } from 'socket.io'
import Broadcaster from '../utils/broadcaster'
import AuthConsts from '../constants/auth'
import MopidyConsts from '../constants/mopidy'
import logger from '../config/logger'
import User, { JBUser } from '../models/user'
import Payload from '../utils/payload'

const isAuthorisedRequest = (key: string): boolean => {
  return (MopidyConsts.AUTHORISED_KEYS as ReadonlyArray<string>).includes(key)
}

const persistUser = (user: JBUser) => {
  const query = { _id: user._id }
  const update = user
  const options = { upsert: true, new: true, setDefaultsOnInsert: true }
  return User.findOneAndUpdate(query, update, options)
}

const AuthenticateHandler = (payload: Payload, socket: Socket): Promise<Payload> => {
  if (!isAuthorisedRequest(payload.key)) {
    delete payload.jwt
    return Promise.resolve(payload)
  }

  return new Promise((resolve) => {
    const broadcastTo = (headers: any, message: any): void => {
      Broadcaster.toClient({ socket, headers, message })
    }

    const responsePayload: Payload = {
      data: payload.data,
      key: payload.key,
      user: {
        _id: '111779595380184084299',
        fullname: 'Duncan Robertson',
        picture:
          'https://lh3.googleusercontent.com/a-/AOh14GjwXol-s9_MiD_cgRM9UKPkXAVAs0yQDVd_dfOCtQ=s96-c'
      },
      hd: 'kyan'
    }

    try {
      return persistUser(responsePayload.user)
        .then(() => resolve(responsePayload))
        .catch((err: any) => logger.error('Error checking user', { error: err.message }))
    } catch (err: any) {
      broadcastTo(payload, { error: err.message })
    }
  })
}

export default AuthenticateHandler

import logger from 'config/winston'
import MopidyHandler from 'handlers/mopidy'
import AuthenticateHandler from 'handlers/authenticate'

const MessageTriage = (payload, mopidy, fn) => {
  const { service } = payload

  switch (service) {
    case 'mopidy':
      return fn((ws, bcast) => {
        AuthenticateHandler(payload, ws, bcast, (updatedPayload) => {
          MopidyHandler(updatedPayload, ws, bcast, mopidy)
        })
      })
    default:
      logger.warn(`Can't find handler for: ${service}`)
  }
}

export default MessageTriage

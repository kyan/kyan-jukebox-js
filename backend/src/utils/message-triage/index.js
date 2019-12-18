import logger from 'config/winston'
import MopidyHandler from 'handlers/mopidy'
import SearchHandler from 'handlers/search'
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
    case 'search':
      return fn((ws, bcast) => {
        AuthenticateHandler(payload, ws, bcast, (updatedPayload) => {
          SearchHandler(updatedPayload, ws, bcast)
        })
      })
    default:
      logger.warn(`Can't find handler for: ${service}`)
  }
}

export default MessageTriage

import MopidyHandler from '../handlers/mopidy'
import HandshakeHandler from '../handlers/handshake'
import AuthenticateHandler from '../handlers/authenticate'

const MessageTriage = (payload, mopidy, fn) => {
  const { service } = payload

  switch (service) {
    case 'mopidy':
      return fn((ws, bcast) => {
        AuthenticateHandler(payload, ws, bcast, (updatedPayload) => {
          MopidyHandler(updatedPayload, ws, bcast, mopidy)
        })
      })
    case 'auth':
      return fn((ws, bcast) => {
        HandshakeHandler(payload, ws, bcast)
      })
    default:
      console.log(`[Warning] Can't find handler for: ${service}`)
  }
}

export default MessageTriage

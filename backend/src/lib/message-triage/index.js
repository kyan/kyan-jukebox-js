import MopidyHandler from '../handlers/mopidy'
import Payload from '../payload'

const MessageTriage = (payload, mopidy, fn) => {
  const { service } = Payload.decode(payload)

  switch (service) {
    case 'mopidy':
      return fn((ws, broadcaster) => {
        return MopidyHandler(payload, ws, broadcaster, mopidy)
      })
    default:
      console.log('UNKNOWN MESSAGE SERVICE: ', service)
  }
}

export default MessageTriage

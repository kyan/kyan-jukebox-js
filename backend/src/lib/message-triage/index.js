import MopidyHandler from '../handlers/mopidy'
import Payload from '../payload'

const MessageTriage = (payload, mopidy, callback) => {
  const { service } = Payload.decode(payload)

  switch (service) {
    case 'votes':
      throw new Error('Voting not implimented yet!')
    default:
      const handler = (ws, broadcaster) => {
        return MopidyHandler(payload, ws, broadcaster, mopidy)
      }
      return callback(handler)
  }
}

export default MessageTriage

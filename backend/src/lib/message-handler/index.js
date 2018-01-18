import StrToFunction from '../str-to-function'
import Payload from '../payload'

const MessageHandler = (payload, ws, broadcaster, mopidy) => {
  const { key, data } = Payload.decode(payload)
  const apiCall = StrToFunction(mopidy, key)

  ;(data ? apiCall(data) : apiCall())
    .then(response => broadcaster.to(ws, key, response))
    .catch(console.error.bind(console))
    .done()
}

export default MessageHandler

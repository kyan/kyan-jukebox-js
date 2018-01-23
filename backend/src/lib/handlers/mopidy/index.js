import StrToFunction from '../../str-to-function'
import Payload from '../../payload'

const MopidyHandler = (payload, ws, broadcaster, mopidy) => {
  const { service, key, data } = Payload.decode(payload)
  const apiCall = StrToFunction(mopidy, key)
  const encodedKey = Payload.encodeKey(service, key)

  ;(data ? apiCall(data) : apiCall())
    .then(response => broadcaster.to(ws, encodedKey, response))
    .catch(console.error.bind(console))
    .done()
}

export default MopidyHandler

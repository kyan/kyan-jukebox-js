import StrToFunction from './../str-to-function'

const MessageHandler = (payload, ws, broadcaster, mopidy) => {
  const { key, params } = JSON.parse(payload)
  const apiCall = StrToFunction(mopidy, key);

  (params ? apiCall(params) : apiCall())
    .then(data => broadcaster.to(ws, key, data))
    .catch(console.error.bind(console))
    .done()
}

export default MessageHandler

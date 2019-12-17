import EventLogger from 'utils/event-logger'
import MopidyConst from 'constants/mopidy'
import MessageType from 'constants/message'
import SearchConst from 'constants/search'
import Spotify from 'services/spotify'

const sendToClient = (bcast, ws, payload, data) => {
  bcast.to(ws, payload, data, MessageType.SEARCH)
}

const logEvent = (headers, params, response, context) => {
  EventLogger({ encoded_key: headers.encoded_key }, params, response, context)
}

const SearchHandler = (payload, ws, bcast) => {
  const { data } = payload
  logEvent(payload, data, null, SearchConst.SEARCH_GET_TRACKS)

  Spotify.search(data).then((tracks) => {
    sendToClient(bcast, ws, payload, tracks)
  }).catch((err) => {
    payload.encoded_key = MopidyConst.VALIDATION_ERROR
    sendToClient(bcast, ws, payload, err.message)
  })
}

export default SearchHandler

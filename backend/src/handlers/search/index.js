import Broadcaster from 'utils/broadcaster'
import MopidyConst from 'constants/mopidy'
import MessageType from 'constants/message'
import Spotify from 'services/spotify'
import EventLogger from 'utils/event-logger'
import Decorator from 'decorators/search'

const SearchHandler = (payload, socket) => {
  const { data } = payload
  EventLogger.info('SEARCH', payload, true)

  const broadcastTo = (headers, message) => {
    Decorator.parse(headers, message).then(unifiedMessage => {
      Broadcaster.toClient(socket, headers, unifiedMessage, MessageType.SEARCH)
    })
  }

  Spotify.search(data).then((tracks) => {
    broadcastTo(payload, tracks)
  }).catch((err) => {
    payload.key = MopidyConst.VALIDATION_ERROR
    broadcastTo(payload, err.message)
  })
}

export default SearchHandler

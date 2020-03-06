import Broadcaster from 'utils/broadcaster'
import MessageType from 'constants/message'
import Spotify from 'services/spotify'
import EventLogger from 'utils/event-logger'
import Decorator from 'decorators/search'

const SearchHandler = ({ socket, payload }) => {
  const { data } = payload
  EventLogger.info('SEARCH', payload, true)

  const broadcastTo = (headers, message) => {
    Decorator.parse(headers, message).then(unifiedMessage => {
      Broadcaster.toClient({ socket, headers, message: unifiedMessage, type: MessageType.SEARCH })
    })
  }

  Spotify.search(data).then((tracks) => {
    broadcastTo(payload, tracks)
  })
}

export default SearchHandler

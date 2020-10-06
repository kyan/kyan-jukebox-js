import Broadcaster from '../utils/broadcaster'
import MessageType from '../constants/message'
import Spotify from '../services/spotify'
import EventLogger from '../utils/event-logger'
import SearchDecorator from '../decorators/search'
import Payload from '../utils/payload'

interface SearchHandler {
  socket: SocketIO.Socket
  payload: Payload
}

const SearchHandler = ({ socket, payload }: SearchHandler) => {
  const { data } = payload
  EventLogger.info('SEARCH', payload, true)

  const broadcastTo = (headers: Payload, response: SpotifyApi.SearchResponse) => {
    SearchDecorator.parse(headers, response).then((results) => {
      Broadcaster.toClient({
        socket,
        headers,
        message: results,
        type: MessageType.SEARCH
      })
    })
  }

  Spotify.search(data).then((response) => {
    broadcastTo(payload, response)
  })
}

export default SearchHandler

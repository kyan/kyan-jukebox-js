import * as actions from '../../actions'
import findImage from '../../utils/find-image-in-cache'

const JukeboxMiddleware = (() => {
  let socket = null

  const refreshInitialState = (store) => {
    store.dispatch(actions.getCurrentTrack())
    store.dispatch(actions.getTimePosition())
    store.dispatch(actions.getTrackList())
  }

  const onOpen = (ws, store, token) => evt => {
    refreshInitialState(store)
  }

  const onClose = (ws, store) => evt => {
    store.dispatch(actions.wsDisconnected())
  }

  const onMessage = (ws, store) => evt => {
    let result = JSON.parse(evt.data)
    let { key, data } = result
    store.dispatch(actions.storePayload(evt.data))

    switch (key) {
      case 'playback.getCurrentTrack':
      case 'event:trackPlaybackStarted':
        store.dispatch(actions.addTrack(data.track))
        store.dispatch(actions.getImage(data.track.album.uri))
        break
      case 'event:tracklistChanged':
        store.dispatch(actions.getTrackList())
        break
      case 'tracklist.getTracks':
        store.dispatch(actions.addTrackList(data))
        data.forEach(item => {
          store.dispatch(actions.getImage(item.track.album.uri))
        })
        break
      case 'library.getImages':
        store.dispatch(actions.resolveImage(data))
        break
      default:
        console.log(`Unknown message: ${key} body: ${data}`)
        break
    }
  }

  return store => next => action => {
    switch (action.type) {
      case 'CONNECT':
        if (socket != null) { socket.close(); }
        store.dispatch(actions.wsConnecting())

        socket = new WebSocket(action.url)
        socket.onmessage = onMessage(socket, store)
        socket.onclose = onClose(socket, store)
        socket.onopen = onOpen(socket, store)
        break
      case 'DISCONNECT':
        if (socket != null) { socket.close(); }
        socket = null
        store.dispatch(actions.wsDisconnected())
        break
      case 'SEND':
        if (action.key === 'library.getImages') {
          if (findImage(action.uri, store.getState().assets)) {
            break
          }
          store.dispatch(actions.newImage(action.uri))
        }

        socket.send(JSON.stringify({
          key: action.key,
          params: action.params
        }))
        break;
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware

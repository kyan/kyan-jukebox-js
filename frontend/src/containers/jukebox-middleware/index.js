import * as actions from '../../actions'

// const PayloadParser = (payload, dispatch) => {
//   let result = JSON.parse(payload)
//   let { key, data } = result
//   let value

//   if (key === 'playback.getCurrentTrack' || key === 'event:trackPlaybackStarted') {
//     dispatch(addTrack(data.track));
//     //this.getImage(data.track.album.uri);
//   }

  // if (key === 'library.getImages') {
  //   const images = data[this.currentTrackLoading]

  //   if (images) {
  //     key = 'currentTrackImage'
  //     value = images[1].uri
  //   }
  // }
// }

const JukeboxMiddleware = (() => {
  let socket = null

  const onOpen = (ws, store, token) => evt => {
    store.dispatch(actions.getCurrentTrack())
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
        store.dispatch(actions.getImage(data.track.album.uri, 'currentTrack'))
        break
      case 'library.getImages':
        store.dispatch(actions.resolveImage(data))
        break
      default:
        console.log(`Unknown message: ${key} body: ${data}`)
        break
    }
  }

  const onAsset = (asset, store) => {
    if (asset) {
      store.dispatch(actions.newImage(asset))
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
        onAsset(action.asset, store)

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

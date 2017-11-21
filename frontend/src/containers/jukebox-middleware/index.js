import * as actions from '../../actions'
import Constants from '../../constants'
import { findImageInCache } from '../../utils/images'
import ProgressTimer from 'media-progress-timer'
import onMessageHandler from '../../utils/on-message-handler'

const JukeboxMiddleware = (() => {
  let wsurl = 'ws://localhost:8000'
  let reconnectTimeout = 5000
  let socket = null
  let progressTimer = null
  let reconnectTimer = null

  const refreshInitialState = (store) => {
    [
      'getCurrentTrack',
      'getTimePosition',
      'getTrackList'
    ].forEach(action => {
      store.dispatch(actions[action]())
    })
  }

  const onOpen = (store, token) => evt => {
    clearTimeout(reconnectTimer)
    progressTimer = ProgressTimer({
      callback: (position, duration) => {
        store.dispatch(actions.updateProgressTimer(position, duration))
      },
      fallbackTargetFrameRate: 1,
      disableRequestAnimationFrame: true
    })
    store.dispatch(actions.wsConnected())
    refreshInitialState(store)
  }

  const onClose = (store) => evt => {
    progressTimer.reset()
    store.dispatch(actions.wsDisconnect())
    reconnectTimer = setTimeout(() => {
      store.dispatch(actions.wsConnect())
    }, reconnectTimeout)
  }

  const onMessage = (store) => evt => {
    onMessageHandler(store, evt.data, progressTimer)
  }

  const onConnect = (store) => {
    if (socket != null) { socket.close(); }
    store.dispatch(actions.wsConnecting())

    socket = new WebSocket(wsurl)
    socket.onmessage = onMessage(store)
    socket.onclose = onClose(store)
    socket.onopen = onOpen(store)
  }

  const onDisconnect = (store) => {
    if (socket != null) { socket.close(); }
    socket = null
    store.dispatch(actions.wsDisconnected())
  }

  return store => next => action => {
    switch (action.type) {
      case 'CONNECT':
        onConnect(store)
        break
      case 'DISCONNECT':
        onDisconnect(store)
        break
      case 'SEND':
        if (action.key === Constants.LIBRARY_GET_IMAGES) {
          const cache = store.getState().assets
          if (findImageInCache(action.uri, cache)) { break }
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

import * as actions from '../../actions'
import MopidyApi from '../../constants/mopidy-api'
import Constants from '../../constants'
import { findImageInCache } from '../../utils/images'
import { trackProgressTimer } from '../../utils/time'
import onMessageHandler from '../../utils/on-message-handler'
import Payload from '../../utils/payload'
import State from '../../utils/state'

const JukeboxMiddleware = (() => {
  let wsurl = `ws://${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}`
  let reconnectTimeout = 1000
  let socket = null
  let progressTimer = null
  let connectionAttempts = 0
  let retryTimeout

  const tryToReconnect = (store) => {
    if (retryTimeout) { clearTimeout(retryTimeout) }

    retryTimeout = setTimeout(() => {
      store.dispatch(actions.wsConnect())
    }, connectionAttempts * reconnectTimeout)
    connectionAttempts++
  }

  const onOpen = (store, token) => evt => {
    progressTimer = trackProgressTimer(store, actions)
    store.dispatch(actions.wsConnected())
    State.loadInitial(store)
  }

  const onClose = (store) => evt => {
    store.dispatch(actions.wsDisconnect())
  }

  const onMessage = (store) => evt => {
    onMessageHandler(store, evt.data, progressTimer)
  }

  const onConnect = (store) => {
    if (socket != null) { socket.close() }
    store.dispatch(actions.wsConnecting())

    socket = new WebSocket(wsurl)
    socket.onmessage = onMessage(store)
    socket.onclose = onClose(store)
    socket.onopen = onOpen(store)
  }

  const onDisconnect = (store) => {
    if (progressTimer) { progressTimer.reset() }
    if (socket != null) { socket.close() }
    socket = null
    tryToReconnect(store)
    store.dispatch(actions.wsDisconnected())
  }

  const getJWT = (store) => {
    return store.getState().settings.token
  }

  return store => next => action => {
    switch (action.type) {
      case Constants.CONNECT:
        onConnect(store)
        break
      case Constants.DISCONNECT:
        onDisconnect(store)
        break
      case Constants.SEND:
        if (action.key === MopidyApi.LIBRARY_GET_IMAGES) {
          if (!action.uri) { break }
          if (findImageInCache(action.uri, store.getState().assets)) { break }
          store.dispatch(actions.newImage(action.uri))
        }

        socket.send(Payload.encodeToJson(getJWT(store), action.key, action.params))
        break
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware

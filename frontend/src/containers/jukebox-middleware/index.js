import * as actions from '../../actions'
import MopidyApi from '../../constants/mopidy-api'
import Constants from '../../constants'
import { findImageInCache } from '../../utils/images'
import { trackProgressTimer } from '../../utils/time'
import onMessageHandler from '../../utils/on-message-handler'
import Payload from '../../utils/payload'

const JukeboxMiddleware = (() => {
  let wsurl = `ws://${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}`
  let reconnectTimeout = 1000
  let socket = null
  let progressTimer = null
  let connectionAttempts = 0

  const refreshInitialState = (store) => {
    [
      'getCurrentTrack',
      'getTimePosition',
      'getState',
      'getTrackList',
      'getVolume'
    ].forEach(action => {
      store.dispatch(actions[action]())
    })
  }

  const onOpen = (store, token) => evt => {
    progressTimer = trackProgressTimer(store, actions)
    store.dispatch(actions.wsConnected())
    refreshInitialState(store)
  }

  const onClose = (store) => evt => {
    store.dispatch(actions.wsDisconnect())
    progressTimer = undefined

    setTimeout(() => {
      store.dispatch(actions.wsConnect())
    }, connectionAttempts * reconnectTimeout)
    connectionAttempts++
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
    if (socket != null) { socket.close() }
    socket = null
    store.dispatch(actions.wsDisconnected())
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

        socket.send(Payload.encodeToJson(action.key, action.params))
        break
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware

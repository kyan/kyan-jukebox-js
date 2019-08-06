import io from 'socket.io-client'
import * as actions from '../../actions'
import MopidyApi from '../../constants/mopidy-api'
import Constants from '../../constants'
import { findImageInCache } from '../../utils/images'
import { trackProgressTimer } from '../../utils/time'
import onMessageHandler from '../../utils/on-message-handler'
import Payload from '../../utils/payload'
import State from '../../utils/state'

const JukeboxMiddleware = (() => {
  let url = `http://${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}`
  let socket = null
  let progressTimer = null

  const onOpen = (store, _token) => _evt => {
    progressTimer = trackProgressTimer(store, actions)
    store.dispatch(actions.wsConnected())
    State.loadInitial(store)
  }

  const onClose = (store) => _evt => {
    store.dispatch(actions.wsDisconnect())
  }

  const onMessage = (store) => data => {
    onMessageHandler(store, data, progressTimer)
  }

  const onConnect = (store) => {
    if (socket != null) { socket.close() }
    store.dispatch(actions.wsConnecting())

    socket = io(url, {
      transports: ['websocket']
    })
    socket.on('message', onMessage(store))
    socket.on('connect', onOpen(store))
    socket.on('disconnect', onClose(store))
  }

  const onDisconnect = (store) => {
    if (progressTimer) { progressTimer.reset() }
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

        socket.emit('message', Payload.encodeToJson(getJWT(store), action.key, action.params))
        break
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware

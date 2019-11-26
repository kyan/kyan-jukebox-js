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

  return store => next => action => {
    const isImageRequest = () => action.key === MopidyApi.LIBRARY_GET_IMAGES
    const imageIsCached = () => findImageInCache(action.uri, store.getState().assets)
    const preStoreImage = () => store.dispatch(actions.newImage(action.uri))
    const getJWT = () => store.getState().settings.token
    const packMessage = () => Payload.encodeToJson(getJWT(store), action.key, action.params)

    const mopidyStateChange = data => {
      if (JSON.parse(data).online) {
        store.dispatch(actions.mopidyConnected())
        return State.loadInitial(store)
      }
      store.dispatch(actions.mopidyDisconnected())
    }
    const onOpen = _evt => {
      progressTimer = trackProgressTimer(store, actions)
      store.dispatch(actions.wsConnected())
    }
    const onClose = _evt => store.dispatch(actions.wsDisconnect())
    const onMessage = data => onMessageHandler(store, data, progressTimer)
    const onConnect = () => {
      if (socket != null) socket.close()
      socket = io(url, { transports: ['websocket'] })
      socket.on('mopidy', mopidyStateChange)
      socket.on('message', onMessage)
      socket.on('connect', onOpen)
      socket.on('disconnect', onClose)

      store.dispatch(actions.wsConnecting())
    }
    const onDisconnect = () => {
      if (progressTimer) { progressTimer.reset() }
      store.dispatch(actions.wsDisconnected())
    }

    switch (action.type) {
      case Constants.CONNECT:
        return onConnect()
      case Constants.DISCONNECT:
        return onDisconnect()
      case Constants.SEND:
        if (isImageRequest() && imageIsCached()) return
        if (isImageRequest()) preStoreImage()

        return socket.emit('message', packMessage())
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware

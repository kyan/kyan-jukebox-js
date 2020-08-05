import io from 'socket.io-client'
import * as actions from 'actions'
import Constants from 'constants/common'
import VoteConstant from 'votes/constants'
import SearchConst from 'search/constants'
import { trackProgressTimer } from 'utils/time'
import onMessageHandler from 'utils/on-message-handler'
import Payload from 'utils/payload'
import State from 'utils/state'
import { Middleware, MiddlewareAPI, Action } from 'redux'
import { Dispatch } from 'react'

interface ActionInterface extends Action {
  key: string
  params: any
}

const JukeboxMiddleware: Middleware = (() => {
  const url = `http://${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_WS_PORT}`
  let socket: SocketIOClient.Socket
  let progressTimer: any = null

  return (store: MiddlewareAPI) => (next: Dispatch<any>) => (action: ActionInterface) => {
    const getJWT = (): string => store.getState().settings.token
    const packMessage = () =>
      Payload.encodeToJson({
        jwt: getJWT(),
        key: action.key,
        data: action.params
      })

    const onMopidyStateChange = (data: any) => {
      if (JSON.parse(data).online) {
        store.dispatch(actions.mopidyConnected())
        return State.loadInitial(store)
      }
      store.dispatch(actions.mopidyDisconnected())
    }
    const onOpen = () => {
      progressTimer = trackProgressTimer(store, actions)
      store.dispatch(actions.wsConnected())
    }
    const onClose = () => store.dispatch(actions.wsDisconnect())
    const onMessage = (data: any) => onMessageHandler(store, data, progressTimer)
    const onSearchResults = (data: any) => onMessageHandler(store, data, progressTimer)
    const onVote = (data: any) => onMessageHandler(store, data, progressTimer)
    const onConnect = () => {
      if (socket != null) socket.close()
      socket = io(url, { transports: ['websocket'] })
      socket.on('vote', onVote)
      socket.on('search', onSearchResults)
      socket.on('mopidy', onMopidyStateChange)
      socket.on('message', onMessage)
      socket.on('connect', onOpen)
      socket.on('disconnect', onClose)

      store.dispatch(actions.wsConnecting())
    }
    const onDisconnect = () => {
      if (progressTimer) {
        progressTimer.reset()
      }
      store.dispatch(actions.wsDisconnected())
    }

    switch (action.type) {
      case Constants.CONNECT:
        return onConnect()
      case Constants.DISCONNECT:
        return onDisconnect()
      case Constants.SEND:
        return socket && socket.emit('message', packMessage())
      case SearchConst.SEARCH:
        return socket && socket.emit('search', packMessage())
      case VoteConstant.VOTE:
        return socket && socket.emit('vote', packMessage())
      default:
        return next(action)
    }
  }
})()

export default JukeboxMiddleware

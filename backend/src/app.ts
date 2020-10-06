import express from 'express'
import http from 'http'
import io from 'socket.io'
import MessageType from './constants/message'
import Broadcaster, { StateChange, BroadcastToAll } from './utils/broadcaster'
import Scheduler from './utils/scheduler'
import Payload from './utils/payload'
import MopidyService, { MopidySetting } from './services/mopidy'
import MongodbService from './services/mongodb'
import SocketErrorsHandler from './handlers/socket-errors'
import MopidyHandler from './handlers/mopidy'
import SearchHandler from './handlers/search'
import VoteHandler from './handlers/voting'
import AuthenticateHandler from './handlers/authenticate'

const app = express()
app.disable('x-powered-by')
app.use(function (_req, res) {
  res.send({ msg: 'WebSocket Only!' })
})

const server = http.createServer(app)
const socketio = io(server, { pingTimeout: 30000 })
const isProduction = () => process.env.NODE_ENV === 'production'

const broadcastToAll = (options: BroadcastToAll) =>
  Broadcaster.toAll({ socketio, ...options })
const broadcastMopidyStateChange = (message: StateChange['message']) =>
  Broadcaster.stateChange({ socketio, message })

const initSocketioEventHandlers = (args: MopidySetting) => {
  if (isProduction()) Scheduler.scheduleAutoShutdown(args)

  socketio.on('connection', (socket) => {
    Broadcaster.stateChange({ socket: socket, message: { online: true } })
    SocketErrorsHandler(socket)

    socket.on(MessageType.GENERIC, (data) => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket).then((updatedPayload) =>
        MopidyHandler({
          payload: updatedPayload,
          socketio: socketio,
          socket: socket,
          mopidy: args.mopidy
        })
      )
    })

    socket.on(MessageType.SEARCH, (data) => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket).then((updatedPayload) =>
        SearchHandler({
          payload: updatedPayload,
          socket: socket
        })
      )
    })

    socket.on(MessageType.VOTE, (data) => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket).then((updatedPayload) =>
        VoteHandler({
          payload: updatedPayload,
          socketio: socketio
        })
      )
    })
  })

  process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0)
    })
  })

  return true
}

MongodbService()
  .then(() => MopidyService(broadcastToAll, broadcastMopidyStateChange))
  .then(initSocketioEventHandlers)

export default server

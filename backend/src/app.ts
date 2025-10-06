import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import MessageType from './constants/message'
import AuthConsts from './constants/auth'
import MopidyConsts from './constants/mopidy'
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

const server = createServer((req, res) => {
  // Health check endpoint for kamal-proxy
  if (req.url === '/up' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('OK')
    return
  }

  // For all other requests, let Socket.IO handle them
  res.writeHead(404)
  res.end()
})

const socketio = new Server(server, { pingTimeout: 30000 })
const isProduction = () => process.env.NODE_ENV === 'production'

const broadcastToAll = (options: BroadcastToAll) =>
  Broadcaster.toAll({ socketio, ...options })
const broadcastMopidyStateChange = (message: StateChange['message']) =>
  Broadcaster.stateChange({ socketio, message })

const initSocketioEventHandlers = (args: MopidySetting) => {
  if (isProduction()) Scheduler.scheduleAutoShutdown(args)

  socketio.on('connection', (socket: Socket) => {
    Broadcaster.stateChange({ socket: socket, message: { online: true } })
    SocketErrorsHandler(socket)

    socket.on(MessageType.GENERIC, (data) => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket).then((updatedPayload) => {
        // Don't continue if authentication failed
        if (updatedPayload.key === AuthConsts.USER_NOT_FOUND) {
          return
        }
        // Don't continue to MopidyHandler if this was just a validation request
        if (updatedPayload.key === MopidyConsts.VALIDATE_USER) {
          return
        }
        MopidyHandler({
          payload: updatedPayload,
          socketio: socketio,
          socket: socket,
          mopidy: args.mopidy
        })
      })
    })

    socket.on(MessageType.SEARCH, (data) => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket).then((updatedPayload) => {
        // Don't continue if authentication failed
        if (updatedPayload.key === AuthConsts.USER_NOT_FOUND) {
          return
        }
        // Don't continue to SearchHandler if this was just a validation request
        if (updatedPayload.key === MopidyConsts.VALIDATE_USER) {
          return
        }
        SearchHandler({
          payload: updatedPayload,
          socket: socket
        })
      })
    })

    socket.on(MessageType.VOTE, (data) => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket).then((updatedPayload) => {
        // Don't continue if authentication failed
        if (updatedPayload.key === AuthConsts.USER_NOT_FOUND) {
          return
        }
        // Don't continue to VoteHandler if this was just a validation request
        if (updatedPayload.key === MopidyConsts.VALIDATE_USER) {
          return
        }
        VoteHandler({
          payload: updatedPayload,
          socketio: socketio
        })
      })
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

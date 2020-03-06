import express from 'express'
import http from 'http'
import io from 'socket.io'
import morgan from 'morgan'
import logger from 'config/winston'
import MessageType from 'constants/message'
import Broadcaster from 'utils/broadcaster'
import Scheduler from 'utils/scheduler'
import Payload from 'utils/payload'
import MopidyService from 'services/mopidy'
import MongodbService from 'services/mongodb'
import SocketErrorsHandler from 'handlers/socket-errors'
import MopidyHandler from 'handlers/mopidy'
import SearchHandler from 'handlers/search'
import VoteHandler from 'handlers/voting'
import AuthenticateHandler from 'handlers/authenticate'

const app = express()
app.disable('x-powered-by')
app.use(function (_req, res) { res.send({ msg: 'WebSocket Only!' }) })
app.use(morgan('combined', { stream: logger.stream }))

const server = http.createServer(app)
const socketio = io(server, { pingTimeout: 30000 })

const broadcastToAll = (options) => Broadcaster.toAll({ socketio, ...options })
const broadcastMopidyStateChange = (message) => Broadcaster.stateChange({ socket: socketio, message })
const allowSocketConnections = (mopidy) => {
  Scheduler.scheduleAutoPlayback({ stop: () => mopidy.playback.stop() })

  socketio.on('connection', socket => {
    Broadcaster.stateChange({
      socket: socket.binary(false),
      message: { online: true }
    })
    SocketErrorsHandler(socket)

    socket.on(MessageType.GENERIC, data => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket)
        .then((updatedPayload) => MopidyHandler({
          payload: updatedPayload,
          socketio: socketio.binary(false),
          socket: socket.binary(false),
          mopidy
        }))
    })

    socket.on(MessageType.SEARCH, data => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket)
        .then((updatedPayload) => SearchHandler({
          payload: updatedPayload,
          socket: socket.binary(false)
        }))
    })

    socket.on(MessageType.VOTE, data => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket)
        .then((updatedPayload) => VoteHandler({
          payload: updatedPayload,
          socketio: socketio.binary(false)
        }))
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
  .then(allowSocketConnections)

export default server

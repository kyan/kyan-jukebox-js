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

const broadcastToAll = (key, message) => Broadcaster.toAll(socketio, key, message)
const broadcastMopidyStateChange = (online) => Broadcaster.stateChange(socketio, { online })
const allowSocketConnections = (mopidy) => {
  Scheduler.scheduleAutoPlayback({ stop: () => mopidy.playback.stop() })

  socketio.on('connection', socket => {
    Broadcaster.stateChange(socketio, { online: true })
    SocketErrorsHandler(socket)

    socket.on(MessageType.GENERIC, data => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket)
        .then((updatedPayload) => MopidyHandler(updatedPayload, socket, mopidy))
    })

    socket.on(MessageType.SEARCH, data => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket)
        .then((updatedPayload) => SearchHandler(updatedPayload, socket))
    })

    socket.on(MessageType.VOTE, data => {
      const payload = Payload.decode(data)

      AuthenticateHandler(payload, socket)
        .then((updatedPayload) => VoteHandler(updatedPayload, socket, socketio))
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
MopidyService(
  broadcastToAll,
  broadcastMopidyStateChange,
  allowSocketConnections
)

export default server

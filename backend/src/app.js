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
import MessageTriage from 'utils/message-triage'

const app = express()
app.disable('x-powered-by')
app.use(function (_req, res) { res.send({ msg: 'WebSocket Only!' }) })
app.use(morgan('combined', { stream: logger.stream }))

const server = http.createServer(app)
const socketio = io(server, { pingTimeout: 30000 })

const broadcastToAll = (key, message) => Broadcaster.toAllGeneric(socketio, key, message)
const broadcastMopidyStateChange = (online) => Broadcaster.toAllMopidy(socketio, { online })
const allowSocketConnections = (mopidy) => {
  Scheduler.scheduleAutoPlayback({ stop: () => mopidy.playback.stop() })

  socketio.on('connection', socket => {
    Broadcaster.toAllMopidy(socketio, { online: true })
    SocketErrorsHandler(socket)

    socket.on(MessageType.GENERIC, data => {
      const payload = Payload.decode(data)

      MessageTriage(payload, mopidy, handler => {
        handler(socket, Broadcaster)
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
MopidyService(
  broadcastToAll,
  broadcastMopidyStateChange,
  allowSocketConnections
)

export default server

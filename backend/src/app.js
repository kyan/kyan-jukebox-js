import express from 'express'
import http from 'http'
import io from 'socket.io'
import morgan from 'morgan'
import logger from 'config/winston'
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
const GENERIC_MESSAGE = 'message'
const MOPIDY_MESSAGE = 'mopidy'

const broadcastToAll = (data) => socketio.emit(GENERIC_MESSAGE, data)
const broadcastMopidyStateChange = (online) => socketio.emit(MOPIDY_MESSAGE, Payload.toJsonString({ online }))
const allowSocketConnections = (mopidy) => {
  Scheduler.scheduleAutoPlayback({ stop: () => mopidy.playback.stop() })

  socketio.on('connection', socket => {
    socketio.emit(MOPIDY_MESSAGE, Payload.toJsonString({ online: true }))
    SocketErrorsHandler(socket)

    socket.on(GENERIC_MESSAGE, data => {
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

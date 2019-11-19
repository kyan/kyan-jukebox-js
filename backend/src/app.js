import express from 'express'
import http from 'http'
import io from 'socket.io'
import morgan from 'morgan'
import winston from './config/winston'
import Broadcaster from './lib/broadcaster'
import Scheduler from './lib/scheduler'
import Payload from './lib/payload'
import MopidyService from './lib/services/mopidy'
import MongodbService from './lib/services/mongodb'
import ErrorsHandler from './lib/handlers/error'
import MessageTriage from './lib/message-triage'

const app = express()
app.disable('x-powered-by')
app.use(function (_req, res) { res.send({ msg: 'WebSocket Only!' }) })
app.use(morgan('combined', { stream: winston.stream }))

const server = http.createServer(app)
const wss = io(server, { pingTimeout: 30000 })

MongodbService()

MopidyService(wss, mopidy => {
  if (mopidy.playback) {
    Scheduler.scheduleAutoPlayback({
      stop: () => mopidy.playback.stop()
    })
  }

  wss.on('connection', socket => {
    ErrorsHandler(socket)

    socket.on('message', data => {
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
})

export default server

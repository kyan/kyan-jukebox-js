import express from 'express'
import http from 'http'
import WebSocket from 'ws'
import morgan from 'morgan'
import winston from './config/winston'
import Payload from './lib/payload'
import Broadcaster from './lib/broadcaster'
import MopidyService from './lib/services/mopidy'
import MongodbService from './lib/services/mongodb'
import ErrorsHandler from './lib/handlers/error'
import MessageTriage from './lib/message-triage'
import OrphansHandler from './lib/handlers/orphans'

const app = express()
app.disable('x-powered-by')
app.use(function (req, res) { res.send({ msg: 'WebSocket Only!' }) })
app.use(morgan('combined', { stream: winston.stream }))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const broadcaster = new Broadcaster(wss.clients)

OrphansHandler.ping(wss)
MongodbService()

MopidyService(broadcaster, mopidy => {
  wss.on('connection', ws => {
    OrphansHandler.pong(ws)
    ErrorsHandler(ws)

    ws.on('message', data => {
      const payload = Payload.decode(data)

      MessageTriage(payload, mopidy, handler => {
        handler(ws, broadcaster)
      })
    })
  })
})

export default server

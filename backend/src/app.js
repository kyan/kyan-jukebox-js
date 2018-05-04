import express from 'express'
import logger from 'morgan'
import http from 'http'
import WebSocket from 'ws'
import Payload from './lib/payload'
import Broadcaster from './lib/broadcaster'
import MopidyService from './lib/services/mopidy'
import MongodbService from './lib/services/mongodb'
import ErrorsHandler from './lib/handlers/error'
import MessageTriage from './lib/message-triage'

const app = express()
app.disable('x-powered-by')
app.use(function (req, res) { res.send({ msg: 'WebSocket Only!' }) })
app.use(logger('dev', { skip: () => app.get('env') === 'test' }))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const broadcaster = new Broadcaster(data => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
})
MongodbService()

MopidyService(broadcaster, mopidy => {
  wss.on('connection', ws => {
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

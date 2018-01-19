import express from 'express'
import logger from 'morgan'
import http from 'http'
import WebSocket from 'ws'
import Mopidy from 'mopidy'
import Broadcaster from './lib/broadcaster'
import MessageHandler from './lib/message-handler'
import ErrorsHandler from './lib/errors-handler'

const app = express()
app.disable('x-powered-by')
app.use(function (req, res) { res.send({ msg: 'WebSocket Only!' }) })
app.use(logger('dev', { skip: () => app.get('env') === 'test' }))

const { WS_MOPIDY = 'localhost:6680' } = process.env
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const mopidy = new Mopidy({
  webSocketUrl: `ws://${WS_MOPIDY}/mopidy/ws/`,
  callingConvention: 'by-position-or-by-name'
})
const broadcaster = new Broadcaster(data => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
})

mopidy.on('state:online', () => {
  wss.on('connection', ws => {
    ErrorsHandler(ws, wss)

    ws.on('message', payload => {
      MessageHandler(payload, ws, broadcaster, mopidy)
    })
  })

  broadcaster.eventList.forEach(key => {
    mopidy.on(key, data => {
      broadcaster.everyone(key, data)
    })
  })
})

export default server

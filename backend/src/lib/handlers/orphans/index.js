import uuidv4 from 'uuid/v4'
import logger from '../../../config/winston'

const doPing = (wss) => {
  setInterval(function () {
    wss.clients.forEach(client => {
      if (client.isAlive === false) {
        logger.info('Destroying orphan', { clientID: client.id })
        client.terminate()
      }

      client.isAlive = false
      client.ping(() => {})
    })
  }, 30000)
}

const doPong = (ws) => {
  ws.id = uuidv4()
  ws.isAlive = true
  ws.on('pong', function () {
    this.isAlive = true
  })
  logger.info('New client', { clientID: ws.id })
}

const OrphansHandler = {
  ping: wss => doPing(wss),
  pong: ws => doPong(ws)
}

export default OrphansHandler

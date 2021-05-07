import { Socket } from 'socket.io'
import logger from '../config/logger'

function error(e: any) {
  // Handle non connection errors
  if (!['ECONNREFUSED', 'ECONNRESET'].includes(e.code)) {
    throw e
  }
}

const SocketErrorsHandler = (ws: Socket) => {
  ws.on('error', error)
  ws.on('close', () => {
    logger.info('Websocket closed', { clientID: ws.id })
  })
}

export default SocketErrorsHandler

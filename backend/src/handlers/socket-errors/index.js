import logger from 'config/logger'

function error (e) {
  // Handle non connection errors
  if (!['ECONNREFUSED', 'ECONNRESET'].includes(e.code)) {
    throw e
  }
}

const SocketErrorsHandler = (ws) => {
  ws.on('error', error)
  ws.on('close', () => {
    logger.info('Websocket closed', { clientID: ws.id })
  })
}

export default SocketErrorsHandler

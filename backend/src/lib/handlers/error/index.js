import logger from '../../../config/winston'

function error (e) {
  if (e.code === 'ECONNRESET') {
    // A client disconnected un-gracefully
  } else {
    throw e
  }
}

const ErrorsHandler = (ws) => {
  ws.on('error', error)
  ws.on('close', () => {
    logger.info('Websocket closed', { clientID: ws.id })
  })
}

export default ErrorsHandler

function noop () {}
function heartbeat () {
  this.isAlive = true
}
function error (e) {
  if (e.code === 'ECONNRESET') {
    // A client disconnected un-gracefully
  } else {
    throw e
  }
}

const { IS_ALIVE_TIMEOUT = 30000 } = process.env

const ErrorsHandler = (ws, wss) => {
  ws.isAlive = true
  ws.on('pong', heartbeat)
  ws.on('error', error)

  setInterval(() => {
    wss.clients.forEach(client => {
      if (client.isAlive === false) return client.terminate()

      client.isAlive = false
      client.ping(noop)
    })
  }, IS_ALIVE_TIMEOUT)
}

export default ErrorsHandler

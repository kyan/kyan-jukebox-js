function error (e) {
  if (e.code === 'ECONNRESET') {
    // A client disconnected un-gracefully
  } else {
    throw e
  }
}

const ErrorsHandler = (ws) => {
  ws.on('error', error)
}

export default ErrorsHandler

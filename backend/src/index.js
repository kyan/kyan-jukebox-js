import logger from './config/logger'
import server from './app'

const { PORT = 8000 } = process.env
server.listen(PORT, () => {
  logger.info(`Listening on ${PORT}`) // eslint-disable-line no-console
})

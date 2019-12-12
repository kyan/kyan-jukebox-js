import logger from 'config/winston'
import server from './app'
import EnvVars from 'utils/env-vars'

const PORT = Number(EnvVars.get('PORT')) || 8000

server.listen(PORT, () => {
  logger.info(`Listening on ${PORT}`) // eslint-disable-line no-console
})

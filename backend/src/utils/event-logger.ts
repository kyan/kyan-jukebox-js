import lodash from 'lodash'
import { getDatabase } from '../services/database/factory'
import logger from '../config/logger'
import { JBUser } from '../types/database'

interface LoggerPayload {
  key: string
  user: JBUser
  data: any
}

const { pick } = lodash

const EventLogger = {
  info: (label: string, payload: any, createEvent?: boolean): void => {
    const data: LoggerPayload = pick(payload, ['key', 'user', 'data'])

    logger.info(label, data)

    if (data.user && createEvent) {
      const db = getDatabase()
      db.events
        .create({
          user: data.user._id,
          key: data.key,
          payload: data
        })
        .catch((error) => {
          logger.error('Failed to create event', { error: error.message })
        })
    }
  }
}

export default EventLogger

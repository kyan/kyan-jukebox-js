import lodash from 'lodash'
import Event from '../models/event'
import logger from '../config/logger'
import { JBUser } from '../models/user'

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
      Event.create({
        user: data.user._id,
        key: data.key,
        payload: data
      })
    }
  }
}

export default EventLogger

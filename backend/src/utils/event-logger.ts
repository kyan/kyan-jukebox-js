import jsonStringifySafe from 'json-stringify-safe'
import lodash from 'lodash'
import Event from '../models/event'
import logger from '../config/logger'
import { JBUserInterface } from '../models/user'

interface LoggerPayloadInterface {
  key: string
  user: JBUserInterface
  data: any
}

const { pick } = lodash

const EventLogger = {
  info: (label: string, payload: any, createEvent?: boolean): void => {
    const data: LoggerPayloadInterface = pick(payload, ['key', 'user', 'data'])

    logger.info(label, { args: jsonStringifySafe(data) })

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

import jsonStringifySafe from 'json-stringify-safe'
import Event from '../models/event'
import logger from '../config/logger'
import { PayloadInterface } from '../utils/payload'

const EventLogger = {
  info: (label: string, payload: any, createEvent?: boolean): void => {
    const data = (({ key, user, data, response }) => ({ key, user, data, response }))(payload)
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

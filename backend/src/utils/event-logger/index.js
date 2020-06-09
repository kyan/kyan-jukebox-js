import Event from 'services/mongodb/models/event'
import logger from 'config/logger'
import jsonStringifySafe from 'json-stringify-safe'

const EventLogger = {
  info: (label, payload, createEvent) => {
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

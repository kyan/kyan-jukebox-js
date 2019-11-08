import Event from '../services/mongodb/models/event'
import logger from '../../config/winston'
import MopidyConsts from '../constants/mopidy'

const invalidKey = (key) => {
  if (key === MopidyConsts.LIBRARY_GET_IMAGES) return true
  if (key === MopidyConsts.PLAYBACK_GET_TIME_POSITION) return true
  if (key === MopidyConsts.PLAYBACK_GET_STATE) return true
  if (key === MopidyConsts.MIXER_GET_VOLUME) return true

  return false
}

const EventLogger = (headers, request, response, label) => {
  if (invalidKey(headers.encoded_key)) return
  delete (headers.jwt_token)
  delete (headers.token)
  const user = headers.user

  if (user && user._id) {
    Event.create({
      user: user._id,
      key: headers.encoded_key,
      payload: {
        request,
        response
      }
    })
  }
  logger.info(label || 'Event', { headers, request, response })
}

export default EventLogger

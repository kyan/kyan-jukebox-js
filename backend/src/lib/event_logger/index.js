import Event from '../services/mongodb/models/event'
import MopidyConsts from '../constants/mopidy'

const invalidKey = (key) => {
  return (key === MopidyConsts.LIBRARY_GET_IMAGES)
}

const EventLogger = (user, key, payload) => {
  if (!user) return
  if (invalidKey(key)) return

  Event.create({
    user,
    key,
    payload
  })
}

export default EventLogger

import { Server } from 'socket.io'
import VoteConstant from '../constants/votes'
import MessageType from '../constants/message'
import EventLogger from '../utils/event-logger'
import Broadcaster from '../utils/broadcaster'
import { getDatabase } from '../services/database/factory'
import Payload from '../utils/payload'
import { JBUser } from '../types/database'

interface VoteHandler {
  socketio: Server
  payload: Payload
}

const VoteHandler = ({ socketio, payload }: VoteHandler) => {
  const { user, data } = payload
  EventLogger.info('CAST_VOTE', payload, true)

  // Type guard: user should be fully populated at this point after authentication
  if (!user || !user._id || !user.fullname || !user.email) {
    return
  }

  const db = getDatabase()
  db.tracks.updateVote(data.uri, user as JBUser, data.vote).then((track) => {
    Broadcaster.toAll({
      socketio,
      headers: {
        key: VoteConstant.VOTE_CASTED,
        user
      },
      message: track,
      type: MessageType.VOTE
    })
  })
}

export default VoteHandler

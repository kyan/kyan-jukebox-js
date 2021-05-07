import { Server } from 'socket.io'
import VoteConstant from '../constants/votes'
import MessageType from '../constants/message'
import EventLogger from '../utils/event-logger'
import Broadcaster from '../utils/broadcaster'
import { updateTrackVote } from '../models/track'
import Payload from '../utils/payload'

interface VoteHandler {
  socketio: Server
  payload: Payload
}

const VoteHandler = ({ socketio, payload }: VoteHandler) => {
  const { user, data } = payload
  EventLogger.info('CAST_VOTE', payload, true)

  updateTrackVote(data.uri, user, data.vote).then((track) => {
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

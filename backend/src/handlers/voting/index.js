import MopidyConst from 'constants/mopidy'
import VoteConstant from 'constants/votes'
import MessageType from 'constants/message'
import EventLogger from 'utils/event-logger'
import Broadcaster from 'utils/broadcaster'
import { updateTrackVote } from 'services/mongodb/models/track'

const VoteHandler = (payload, socket, socketio) => {
  const { user, data } = payload
  EventLogger.info('CAST_VOTE', payload, true)

  const broadcastTo = (headers, message) => {
    Broadcaster.toClient(socket, headers, message, MessageType.VOTE)
  }

  updateTrackVote(data.uri, user, data.vote).then((track) => {
    Broadcaster.toAll(socketio, VoteConstant.VOTE_CASTED, track, MessageType.VOTE)
  }).catch((err) => {
    payload.key = MopidyConst.VALIDATION_ERROR
    broadcastTo(payload, err.message)
  })
}

export default VoteHandler

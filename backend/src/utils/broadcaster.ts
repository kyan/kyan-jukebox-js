import logger from '../config/logger'
import MessageType from '../constants/message'
import EventLogger from '../utils/event-logger'
import Payload from '../utils/payload'

interface Socket {
  socket?: SocketIO.Socket
  socketio?: SocketIO.Server
}

export interface BroadcastToAll extends Socket {
  headers: any
  message: any
  type?: string
}

interface Message {
  online: boolean
}

export interface StateChange extends Socket {
  message: Message
}

const Broadcaster = {
  /**
   * Sends a message to a specific connected user
   */
  toClient: ({
    socket,
    headers,
    message,
    type = MessageType.GENERIC
  }: BroadcastToAll): void => {
    try {
      const payload = Payload.encodeToJson({
        key: headers.key,
        data: message,
        user: headers.user
      })
      const context = headers.user
        ? MessageType.OUTGOING_API_AUTH
        : MessageType.OUTGOING_API

      EventLogger.info(context, { key: headers.key, data: message })
      socket.emit(type, payload)
    } catch (e) {
      logger.error('Broadcaster#toClient', { message: e.message })
    }
  },

  /**
   * Sends a message to all connected users
   */
  toAll: ({
    socketio,
    headers,
    message,
    type = MessageType.GENERIC
  }: BroadcastToAll): void => {
    try {
      const payload = Payload.encodeToJson({
        key: headers.key,
        data: message,
        user: headers.user
      })

      EventLogger.info(MessageType.OUTGOING_ALL, { key: headers.key, data: message })
      socketio.emit(type, payload)
    } catch (e) {
      logger.error('Broadcaster#toAll', { message: e.message })
    }
  },

  /**
   * Sends a state change message to user/users
   */
  stateChange: ({ socket, socketio, message }: StateChange): void => {
    const payload = JSON.stringify(message)

    try {
      EventLogger.info(MessageType.OUTGOING_STATE_CHANGE, { key: 'state', data: message })

      if (socket) socket.emit(MessageType.MOPIDY, payload)
      if (socketio) socketio.emit(MessageType.MOPIDY, payload)
    } catch (e) {
      logger.error('Broadcaster#stateChange', { message: e.message })
    }
  }
}

export default Broadcaster

import logger from '../config/logger'
import MessageType from '../constants/message'
import EventLogger from '../utils/event-logger'
import Payload from '../utils/payload'

export interface ToClientInterface {
  socket: SocketIO.Socket
  headers: any
  message: any
  type?: string
}

export interface ToAllInterface {
  socketio: SocketIO.Server
  headers: any
  message: any
  type?: string
}

export interface StateChangeMessageInterface {
  online: boolean
}

export interface StateChangeInterface {
  socket?: SocketIO.Socket
  socketio?: SocketIO.Server
  message: StateChangeMessageInterface
}

const Broadcaster = {
  toClient: ({ socket, headers, message, type = MessageType.GENERIC }: ToClientInterface): void => {
    try {
      const payload = Payload.encodeToJson({
        key: headers.key,
        data: message,
        user: headers.user
      })
      const context = headers.user ? MessageType.OUTGOING_API_AUTH : MessageType.OUTGOING_API

      EventLogger.info(context, { key: headers.key, data: message })
      socket.emit(type, payload)
    } catch (e) {
      logger.error('Broadcaster#toClient', { message: e.message })
    }
  },

  toAll: ({ socketio, headers, message, type = MessageType.GENERIC }: ToAllInterface): void => {
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

  stateChange: ({ socket, socketio, message }: StateChangeInterface): void => {
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
import Mopidy from 'mopidy'
import logger from '../config/logger'
import EventLogger from '../utils/event-logger'
import MopidyConstants from '../constants/mopidy'
import MessageType from '../constants/message'
import Decorator from '../decorators/mopidy'
import Setting, { DBSettingStatics } from '../models/setting'
import { StateChange, BroadcastToAll } from '../utils/broadcaster'

type BroadcastToAllType = (options: BroadcastToAll) => void
type BroadcastStateChangeType = (message: StateChange['message']) => void

export interface MopidySetting {
  mopidy: Mopidy
  setting: DBSettingStatics
}

const mopidyUrl = process.env.WS_MOPIDY_URL
const mopidyPort = process.env.WS_MOPIDY_PORT
let firstTime = false

const MopidyService = (
  broadcastToAll: BroadcastToAllType,
  broadcastStateChange: BroadcastStateChangeType
) => {
  return new Promise<MopidySetting>((resolve) => {
    const mopidy = new Mopidy({
      webSocketUrl: `ws://${mopidyUrl}:${mopidyPort}/mopidy/ws/`
    })

    const initCurrentTrackState = (mopidy: Mopidy) => {
      Promise.all([mopidy.playback.getCurrentTrack(), mopidy.tracklist.getTracks()]).then(
        async (responses) => {
          await Setting.initializeState(responses[0], responses[1])
          await Setting.trimTracklist(mopidy)
          firstTime
            ? broadcastStateChange({ online: true })
            : resolve({ mopidy, setting: Setting })
          firstTime = true
        }
      )
    }

    mopidy.on('websocket:error', (err: any) => {
      logger.error(`Mopidy Error: ${err.message}`, { url: `${mopidyUrl}:${mopidyPort}` })
      Setting.clearState()
    })

    mopidy.on('state:offline', () => {
      logger.info('Mopidy Offline', { url: `${mopidyUrl}:${mopidyPort}` })
      broadcastStateChange({ online: false })
      Setting.clearState()
    })

    mopidy.on('state:online', () => {
      logger.info('Mopidy Online', { url: `${mopidyUrl}:${mopidyPort}` })
      initCurrentTrackState(mopidy)
    })

    Object.values(MopidyConstants.CORE_EVENTS).forEach((key) => {
      mopidy.on(key, (message: any) => {
        EventLogger.info(MessageType.INCOMING_CORE, { key, data: message })

        const packAndSend = (
          headers: { [index: string]: string },
          data: unknown,
          funcStr: 'parse' | 'mopidyCoreMessage'
        ) => {
          Decorator[funcStr](headers, data, mopidy).then((unifiedMessage) => {
            broadcastToAll({ headers: { key: headers.key }, message: unifiedMessage })
          })
        }

        if (key === MopidyConstants.CORE_EVENTS.TRACKLIST_CHANGED) {
          mopidy.tracklist
            .getTracks()
            .then((tracks) =>
              Setting.updateTracklist(tracks.map((track) => track.uri)).then(() =>
                packAndSend({ key: MopidyConstants.GET_TRACKS }, tracks, 'parse')
              )
            )
        } else {
          packAndSend({ key }, message, 'mopidyCoreMessage')
        }
      })
    })
  })
}

export default MopidyService

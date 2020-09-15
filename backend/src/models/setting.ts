import { Schema, Document, model, Model } from 'mongoose'
import logger from '../config/logger'
import Mopidy from 'mopidy'
import { JBTrackInterface } from './track'

const SettingSchema = new Schema({
  key: Schema.Types.String,
  value: Schema.Types.Mixed
})

const HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST = 4 as const

export interface DBSettingValueInterface {
  trackSeeds: string[]
  currentTrack: string
  currentTracklist: string[]
}

export interface DBSettingInterface extends Document {
  key: string
  value: DBSettingValueInterface
}

const stateFind = { key: 'state' }
const options = { upsert: true, runValidators: true, setDefaultsOnInsert: true }

SettingSchema.statics.clearState = (): Promise<void> =>
  new Promise((resolve) => {
    return Setting.collection
      .findOneAndReplace(stateFind, stateFind, options)
      .then(() => resolve())
      .catch((error) => logger.error('clearState', { args: error.message }))
  })

SettingSchema.statics.addToTrackSeedList = (
  track: JBTrackInterface
): Promise<void | string> => {
  if (track.metrics && track.metrics.votes > 1 && track.metrics.votesAverage < 50)
    return Promise.resolve()
  if (track.metrics && track.metrics.plays > 2 && track.metrics.votes < 1)
    return Promise.resolve()

  return new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then((state) => {
        const seeds = new Set(state.value.trackSeeds)
        seeds.add(track.uri)
        state.value.trackSeeds = Array.from(seeds)
        state.markModified('value.trackSeeds')
        return state.save()
      })
      .then(() => resolve(track.uri))
      .catch((error) => logger.error('addToTrackSeedList', { args: error.message }))
  })
}

SettingSchema.statics.initializeState = (
  currentTrack: Mopidy.models.Track | null,
  currentTracklist: Mopidy.models.Track[]
): Promise<void> =>
  new Promise((resolve) => {
    const emptyTrackSeeds: string[] = []
    const updateValue = {
      ...stateFind,
      value: {
        currentTrack: currentTrack ? currentTrack.uri : null,
        currentTracklist: currentTracklist.map((track) => track.uri),
        trackSeeds: emptyTrackSeeds
      }
    }
    return Setting.collection
      .findOneAndReplace(stateFind, updateValue, options)
      .then(() => resolve())
      .catch((error) => logger.error('initializeState', { args: error.message }))
  })

SettingSchema.statics.trimTracklist = (mopidy: Mopidy): Promise<boolean> =>
  new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then((state) => {
        const { currentTrack, currentTracklist } = state.value
        const currentTrackIndex = currentTracklist.indexOf(currentTrack)

        if (currentTrackIndex > HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST) {
          const indexToDeleteTo = currentTrackIndex - HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST
          const tracksToTrim = currentTracklist.slice(0, indexToDeleteTo)
          const updateValue = {
            $set: {
              'value.currentTracklist': currentTracklist.slice(indexToDeleteTo)
            }
          }

          return Setting.findOneAndUpdate(stateFind, updateValue, options).then(() => {
            logger.info('trimTracklist', { args: tracksToTrim })

            return mopidy.tracklist
              .remove({ criteria: { uri: tracksToTrim } })
              .then(() => resolve(true))
          })
        }

        return resolve(false)
      })
      .catch((error) => logger.error('trimTracklist', { args: error.message }))
  })

SettingSchema.statics.updateCurrentTrack = (uri: string): Promise<string> =>
  new Promise((resolve) => {
    const updateValue = { $set: { 'value.currentTrack': uri } }
    return Setting.findOneAndUpdate(stateFind, updateValue, options)
      .then(() => resolve(uri))
      .catch((error) => logger.error('updateCurrentTrack', { args: error.message }))
  })

SettingSchema.statics.updateTracklist = (
  uris: ReadonlyArray<string>
): Promise<ReadonlyArray<string>> =>
  new Promise((resolve) => {
    const updateValue = { $set: { 'value.currentTracklist': uris } }
    return Setting.findOneAndUpdate(stateFind, updateValue, options)
      .then(() => resolve(uris))
      .catch((error) => logger.error('updateTracklist', { args: error.message }))
  })

SettingSchema.statics.removeFromSeeds = (uri: string): Promise<string> =>
  new Promise((resolve) => {
    const updateValue = { $pull: { 'value.trackSeeds': uri } }
    return Setting.findOneAndUpdate(stateFind, updateValue, options)
      .then(() => resolve(uri))
      .catch((error) => logger.error('removeFromSeeds', { args: error.message }))
  })

SettingSchema.statics.getSeedTracks = (): Promise<string[]> =>
  new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then((state) => resolve(state.value.trackSeeds || []))
      .catch((error) => logger.error('getSeedTracks', { args: error.message }))
  })

SettingSchema.statics.getTracklist = (): Promise<string[]> =>
  new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then((state) => resolve(state.value.currentTracklist || []))
      .catch((error) => logger.error('getTracklist', { args: error.message }))
  })

interface DBSettingStaticsInterface extends Model<DBSettingInterface> {
  clearState(): Promise<void>
  addToTrackSeedList(track: JBTrackInterface): Promise<void | string>
  initializeState(
    currentTrack: Mopidy.models.Track | null,
    currentTracklist: Mopidy.models.Track[]
  ): Promise<void | string>
  trimTracklist(mopidy: Mopidy): Promise<boolean>
  updateCurrentTrack(uri: string): Promise<string>
  updateTracklist(uris: ReadonlyArray<string>): Promise<ReadonlyArray<string>>
  removeFromSeeds(uri: string): Promise<string>
  getSeedTracks(): Promise<string[]>
  getTracklist(): Promise<string[]>
}

const Setting = model<DBSettingInterface, DBSettingStaticsInterface>(
  'Setting',
  SettingSchema
)

export default Setting

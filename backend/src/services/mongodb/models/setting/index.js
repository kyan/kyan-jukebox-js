import mongoose from 'mongoose'
import logger from 'config/winston'

const HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST = 4

const settingSchema = mongoose.Schema({
  key: mongoose.Schema.Types.String,
  value: mongoose.Schema.Types.Mixed
})
const Setting = mongoose.model('Setting', settingSchema)
const stateFind = { key: 'state' }
const options = { upsert: true, runValidators: true, setDefaultsOnInsert: true }

const addToTrackSeedList = (track) => {
  if (track.metrics && track.metrics.votesAverage < 20) return Promise.resolve()
  if (track.metrics && track.metrics.votes < 1) return Promise.resolve()

  return new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then(state => {
        const seeds = new Set(state.value.trackSeeds)
        seeds.add(track.uri)
        state.value.trackSeeds = Array.from(seeds)

        return state.save()
      })
      .then(() => resolve(track.uri))
      .catch((error) => logger.error(`addToTrackSeedList: ${error.message}`))
  })
}

const clearState = () => {
  return new Promise((resolve) => {
    return Setting.findOneAndReplace(stateFind, stateFind, options)
      .then(() => resolve())
      .catch((error) => logger.error(`clearState: ${error.message}`))
  })
}

const initializeState = (currentTrack, currentTracklist) => {
  return new Promise((resolve) => {
    const updateValue = {
      ...stateFind,
      value: {
        currentTrack: currentTrack ? currentTrack.uri : null,
        currentTracklist: currentTracklist.map(track => track.uri),
        trackSeeds: []
      }
    }
    return Setting.findOneAndReplace(stateFind, updateValue, options)
      .then(() => resolve())
      .catch((error) => logger.error(`initializeState: ${error.message}`))
  })
}

const trimTracklist = (mopidy) => {
  return new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then((state) => {
        const { currentTrack, currentTracklist } = state.value
        const currentTrackIndex = currentTracklist.indexOf(currentTrack)

        if (currentTrackIndex > HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST) {
          const indexToDeleteTo = currentTrackIndex - HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST
          const tracksToTrim = currentTracklist.slice(0, indexToDeleteTo)
          const updateValue = { $set: { 'value.currentTracklist': currentTracklist.slice(indexToDeleteTo) } }

          return Setting.findOneAndUpdate(stateFind, updateValue, options)
            .then(() => {
              logger.info(`trimTracklist: ${tracksToTrim}`)
              return mopidy.tracklist.remove({ uri: tracksToTrim }).then(() => resolve(true))
            })
        }

        return resolve(false)
      })
      .catch((error) => logger.error(`trimTracklist: ${error.message}`))
  })
}

const updateCurrentTrack = (uri) => {
  return new Promise((resolve) => {
    const updateValue = { $set: { 'value.currentTrack': uri } }
    return Setting.findOneAndUpdate(stateFind, updateValue, options)
      .then(() => resolve(uri))
      .catch((error) => logger.error(`updateCurrentTrack: ${error.message}`))
  })
}

const updateTracklist = (uris) => {
  return new Promise((resolve) => {
    const updateValue = { $set: { 'value.currentTracklist': uris } }
    return Setting.findOneAndUpdate(stateFind, updateValue, options)
      .then(() => resolve(uris))
      .catch((error) => logger.error(`updateTracklist: ${error.message}`))
  })
}

const removeFromSeeds = (uri) => {
  return new Promise((resolve) => {
    const updateValue = { $pull: { 'value.trackSeeds': uri } }
    return Setting.findOneAndUpdate(stateFind, updateValue, options)
      .then(() => resolve(uri))
      .catch((error) => logger.error(`removeFromSeeds: ${error.message}`))
  })
}

const getSeedTracks = () => {
  return new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then(state => resolve(state.value.trackSeeds))
      .catch((error) => logger.error(`getSeedTracks: ${error.message}`))
  })
}

const getTracklist = () => {
  return new Promise((resolve) => {
    return Setting.findOne(stateFind)
      .then(state => resolve(state.value.currentTracklist))
      .catch((error) => logger.error(`getTracklist: ${error.message}`))
  })
}

export default Setting
export {
  addToTrackSeedList,
  clearState,
  getSeedTracks,
  getTracklist,
  initializeState,
  removeFromSeeds,
  trimTracklist,
  updateCurrentTrack,
  updateTracklist
}

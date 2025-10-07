import {
  IDatabaseService,
  IUserService,
  ITrackService,
  ISettingService,
  IEventService,
  IImageService,
  MongoDBConfig,
  QueryOptions
} from './interfaces'
import { JBUser, JBTrack, JBAddedBy } from '../../types/database'
import User from '../../models/user'
import Track from '../../models/track'
import Setting from '../../models/setting'
import Event from '../../models/event'
import Image from '../../models/image'
import { connect, disconnect, connection } from 'mongoose'
import logger from '../../config/logger'
import VotingHelper from '../../utils/voting'
import Mopidy from 'mopidy'

class MongoDBUserService implements IUserService {
  async findById(id: string): Promise<JBUser | null> {
    const user = await User.findById(id).exec()
    return user ? user.toObject() : null
  }

  async findByEmail(email: string): Promise<JBUser | null> {
    const user = await User.findOne({ email }).exec()
    return user ? user.toObject() : null
  }

  async create(userData: Omit<JBUser, '_id'>): Promise<JBUser> {
    const userWithId = {
      _id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      ...userData
    }
    const user = new User(userWithId)
    await user.save()
    return user.toObject()
  }

  async update(id: string, updates: Partial<JBUser>): Promise<JBUser | null> {
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).exec()
    return user ? user.toObject() : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id).exec()
    return !!result
  }

  async findOrCreateBRH(): Promise<JBUser> {
    return Track.findOrUseBRH()
  }
}

class MongoDBTrackService implements ITrackService {
  async findByUri(uri: string): Promise<JBTrack | null> {
    const tracks = await this.findByUris([uri])
    return tracks.length > 0 ? tracks[0] : null
  }

  async findByUris(uris: string[]): Promise<JBTrack[]> {
    const tracks = await Track.findTracks(uris)
    return tracks as any // MongoDB tracks will be converted to JBTrack in decorator layer
  }

  async addTracks(
    uris: string[],
    user?: JBUser
  ): Promise<{ uris: string[]; user: JBUser }> {
    return Track.addTracks(uris, user)
  }

  async updatePlaycount(uri: string): Promise<JBTrack | null> {
    const track = await Track.findById(uri)
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .exec()

    if (track && track.addedBy[0]) {
      const played = { at: new Date() }
      track.addedBy[0].played.unshift(played)
      track.metrics.plays = track.metrics.plays + 1
      const savedTrack = await track.save()
      return savedTrack as any // MongoDB track will be converted to JBTrack in decorator layer
    }

    return null
  }

  async updateVote(
    uri: string,
    user: JBUser,
    vote: number
  ): Promise<{
    uri: string
    addedBy: JBAddedBy[]
    metrics: any
  }> {
    const vUser = await Track.findOrUseBRH(user)
    const track = await Track.findById(uri)
      .populate({ path: 'addedBy.user' })
      .populate({ path: 'addedBy.votes.user' })
      .exec()

    if (track && track.addedBy[0]) {
      const currentVote = vote * 10 // VotingHelper.voteNormalised
      const newVote = {
        at: new Date(),
        vote: currentVote,
        user: vUser
      }
      const votes = track.addedBy[0].votes
      const currentVoteIndex = votes.findIndex((v: any) => v.user._id === vUser._id)

      if (currentVoteIndex !== -1) {
        votes[currentVoteIndex].vote = currentVote
      } else {
        votes.unshift(newVote)
        track.metrics.votes = VotingHelper.calcVoteCount(track.addedBy)
      }

      track.metrics.votesTotal = VotingHelper.calcVoteTotal(track.addedBy)
      track.metrics.votesAverage = VotingHelper.calcWeightedMean(track.addedBy)

      const savedTrack = await track.save()
      return {
        uri: savedTrack.id,
        addedBy: savedTrack.addedBy,
        metrics: savedTrack.metrics
      }
    }

    throw new Error('Track not found or invalid')
  }

  async getTrackMetrics(uri: string): Promise<any | null> {
    const track = await Track.findById(uri).select('metrics').exec()
    return track ? track.metrics : null
  }

  async bulkCreate(tracks: Partial<JBTrack>[]): Promise<JBTrack[]> {
    const created = await Track.insertMany(tracks)
    return created.map((track) => track.toObject()) as any
  }

  async findTracksWithLowVotes(trackUris: string[]): Promise<string[]> {
    const tracks = await Track.find({
      _id: { $in: trackUris },
      'metrics.votesAverage': { $lt: 50 },
      'metrics.votes': { $gt: 0 }
    })
      .select('_id')
      .exec()
    return tracks.map((track) => track._id)
  }

  async findTracksPlayedToday(): Promise<string[]> {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const tracks = await Track.find({
      'addedBy.addedAt': { $gt: startOfToday }
    })
      .select('_id')
      .exec()
    return tracks.map((track) => track._id)
  }

  async findRandomTracksWithHighVotes(limit: number): Promise<string[]> {
    const results = await Track.aggregate([
      { $match: { 'metrics.votesAverage': { $gte: 70 } } },
      { $sample: { size: limit } },
      { $project: { _id: 1 } }
    ])
    return results.map((result) => result._id)
  }
}

class MongoDBSettingService implements ISettingService {
  private readonly stateFind = { key: 'state' }
  private readonly options = {
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true
  }
  private readonly HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST = 4 as const

  async clearState(): Promise<void> {
    try {
      await Setting.collection.findOneAndReplace(
        this.stateFind,
        this.stateFind,
        this.options
      )
    } catch (error) {
      logger.error('clearState', { args: error.message })
      throw error
    }
  }

  async initializeState(
    currentTrack: Mopidy.models.Track | null,
    currentTracklist: Mopidy.models.Track[]
  ): Promise<void> {
    try {
      const emptyTrackSeeds: string[] = []
      const updateValue = {
        ...this.stateFind,
        value: {
          currentTrack: currentTrack ? currentTrack.uri : null,
          currentTracklist: currentTracklist.map((track) => track.uri),
          trackSeeds: emptyTrackSeeds
        }
      }
      await Setting.collection.findOneAndReplace(
        this.stateFind,
        updateValue,
        this.options
      )
    } catch (error) {
      logger.error('initializeState', { args: error.message })
      throw error
    }
  }

  async addToTrackSeedList(track: JBTrack): Promise<void | string> {
    if (track.metrics && track.metrics.votes > 1 && track.metrics.votesAverage < 50)
      return Promise.resolve()
    if (track.metrics && track.metrics.plays > 2 && track.metrics.votes < 1)
      return Promise.resolve()

    try {
      const state = await Setting.findOne(this.stateFind).exec()
      if (state) {
        const seeds = new Set(state.value.trackSeeds)
        seeds.add(track.uri)
        state.value.trackSeeds = Array.from(seeds)
        state.markModified('value.trackSeeds')
        await state.save()
        return track.uri
      }
    } catch (error) {
      logger.error('addToTrackSeedList', { args: error.message })
      throw error
    }
  }

  async trimTracklist(mopidy: Mopidy): Promise<boolean> {
    try {
      const state = await Setting.findOne(this.stateFind).exec()
      if (state) {
        const { currentTrack, currentTracklist } = state.value
        const currentTrackIndex = currentTracklist.indexOf(currentTrack)

        if (currentTrackIndex > this.HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST) {
          const indexToDeleteTo =
            currentTrackIndex - this.HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST
          const tracksToTrim = currentTracklist.slice(0, indexToDeleteTo)
          const updateValue = {
            $set: {
              'value.currentTracklist': currentTracklist.slice(indexToDeleteTo)
            }
          }

          await Setting.findOneAndUpdate(this.stateFind, updateValue, this.options).exec()
          logger.info('trimTracklist', { args: tracksToTrim })

          await mopidy.tracklist.remove({ criteria: { uri: tracksToTrim } })
          return true
        }
      }
      return false
    } catch (error) {
      logger.error('trimTracklist', { args: error.message })
      throw error
    }
  }

  async updateCurrentTrack(uri: string): Promise<string> {
    try {
      const updateValue = { $set: { 'value.currentTrack': uri } }
      await Setting.findOneAndUpdate(this.stateFind, updateValue, this.options).exec()
      return uri
    } catch (error) {
      logger.error('updateCurrentTrack', { args: error.message })
      throw error
    }
  }

  async updateTracklist(uris: string[]): Promise<string[]> {
    try {
      const updateValue = { $set: { 'value.currentTracklist': uris } }
      await Setting.findOneAndUpdate(this.stateFind, updateValue, this.options).exec()
      return uris
    } catch (error) {
      logger.error('updateTracklist', { args: error.message })
      throw error
    }
  }

  async removeFromSeeds(uri: string): Promise<string> {
    try {
      const updateValue = { $pull: { 'value.trackSeeds': uri } }
      await Setting.findOneAndUpdate(this.stateFind, updateValue, this.options).exec()
      return uri
    } catch (error) {
      logger.error('removeFromSeeds', { args: error.message })
      throw error
    }
  }

  async getSeedTracks(): Promise<string[]> {
    try {
      const state = await Setting.findOne(this.stateFind).exec()
      return state?.value?.trackSeeds || []
    } catch (error) {
      logger.error('getSeedTracks', { args: error.message })
      return []
    }
  }

  async getTracklist(): Promise<string[]> {
    try {
      const state = await Setting.findOne(this.stateFind).exec()
      return state?.value?.currentTracklist || []
    } catch (error) {
      logger.error('getTracklist', { args: error.message })
      return []
    }
  }

  async getPlayedTracksFromTracklist(): Promise<string[]> {
    try {
      const state = await Setting.findOne(this.stateFind).exec()
      if (!state?.value) return []

      const track = state.value.currentTrack
      const tracklist = state.value.currentTracklist || []

      if (!track) return []

      const currentIndex = tracklist.indexOf(track)
      return currentIndex > 0 ? tracklist.slice(0, currentIndex) : []
    } catch (error) {
      logger.error('getPlayedTracksFromTracklist', { args: error.message })
      return []
    }
  }

  async getCurrentTrack(): Promise<string | null> {
    try {
      const state = await Setting.findOne(this.stateFind).exec()
      return state?.value?.currentTrack || null
    } catch (error) {
      logger.error('getCurrentTrack', { args: error.message })
      return null
    }
  }

  async updateJsonSetting(key: string, value: any): Promise<void> {
    try {
      const updateValue = { $set: { 'value.currentTrack': value } }
      await Setting.findOneAndUpdate({ key }, updateValue, this.options).exec()
    } catch (error) {
      logger.error('updateJsonSetting', { args: error.message })
      throw error
    }
  }
}

class MongoDBEventService implements IEventService {
  async create(eventData: { user: string; key: string; payload: any }): Promise<void> {
    await Event.create(eventData)
  }

  async findByUser(userId: string, options?: QueryOptions): Promise<any[]> {
    let query = Event.find({ user: userId })

    if (options?.sort) {
      query = query.sort(options.sort)
    }

    if (options?.pagination) {
      if (options.pagination.limit) {
        query = query.limit(options.pagination.limit)
      }
      if (options.pagination.offset) {
        query = query.skip(options.pagination.offset)
      }
    }

    const events = await query.exec()
    return events.map((event) => event.toObject())
  }

  async findByKey(key: string, options?: QueryOptions): Promise<any[]> {
    let query = Event.find({ key })

    if (options?.sort) {
      query = query.sort(options.sort)
    }

    if (options?.pagination) {
      if (options.pagination.limit) {
        query = query.limit(options.pagination.limit)
      }
      if (options.pagination.offset) {
        query = query.skip(options.pagination.offset)
      }
    }

    const events = await query.exec()
    return events.map((event) => event.toObject())
  }

  async findRecent(limit: number = 100): Promise<any[]> {
    const events = await Event.find().sort({ _id: -1 }).limit(limit).exec()
    return events.map((event) => event.toObject())
  }

  async deleteOld(beforeDate: Date): Promise<number> {
    const result = await Event.deleteMany({
      _id: { $lt: beforeDate }
    }).exec()
    return result.deletedCount || 0
  }
}

class MongoDBImageService implements IImageService {
  async findByUri(
    uri: string
  ): Promise<{ _id: string; url: string; expireAt: Date } | null> {
    const image = await Image.findById(uri).exec()
    return image ? image.toObject() : null
  }

  async findByUris(
    uris: string[]
  ): Promise<{ _id: string; url: string; expireAt: Date }[]> {
    const images = await Image.find({ _id: { $in: uris } }).exec()
    return images.map((image) => image.toObject())
  }

  async store(uri: string, url: string): Promise<void> {
    const expireAt = this.calculateExpiration()
    await Image.findOneAndUpdate(
      { _id: uri },
      { url, expireAt },
      { upsert: true, new: true }
    ).exec()
  }

  async storeMany(imageData: Record<string, string>): Promise<void> {
    const expireAt = this.calculateExpiration()
    const operations = Object.entries(imageData).map(([uri, url]) => ({
      updateOne: {
        filter: { _id: uri },
        update: { url, expireAt },
        upsert: true
      }
    }))

    if (operations.length > 0) {
      await Image.bulkWrite(operations)
    }
  }

  async deleteExpired(): Promise<number> {
    const result = await Image.deleteMany({
      expireAt: { $lt: new Date() }
    }).exec()
    return result.deletedCount || 0
  }

  async updateExpiration(uri: string, expireAt: Date): Promise<void> {
    await Image.findByIdAndUpdate(uri, { expireAt }).exec()
  }

  private calculateExpiration(): Date {
    const day = 12 * 3600 * 1000
    const today = new Date()
    return new Date(today.getTime() + day * 30)
  }
}

export class MongoDBService implements IDatabaseService {
  public users: IUserService
  public tracks: ITrackService
  public settings: ISettingService
  public events: IEventService
  public images: IImageService

  private config: MongoDBConfig
  private connected: boolean = false

  constructor(config: MongoDBConfig) {
    this.config = config
    this.users = new MongoDBUserService()
    this.tracks = new MongoDBTrackService()
    this.settings = new MongoDBSettingService()
    this.events = new MongoDBEventService()
    this.images = new MongoDBImageService()
  }

  async connect(): Promise<void> {
    try {
      await connect(
        this.config.connectionString,
        this.config.options || { maxPoolSize: 10 }
      )
      this.connected = true
      logger.info('MongoDB Connected', { url: this.config.connectionString })
    } catch (error) {
      this.connected = false
      logger.error('MongoDB Connection Failed', { error: error.message })
      throw new Error('MongoDB failed to connect!')
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await disconnect()
      this.connected = false
      logger.info('MongoDB Disconnected')
    }
  }

  isConnected(): boolean {
    return this.connected && connection.readyState === 1
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const session = await connection.startSession()
    try {
      session.startTransaction()
      const result = await callback()
      await session.commitTransaction()
      return result
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      await session.endSession()
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        return false
      }

      // Simple ping to verify connection
      await connection.db.admin().ping()
      return true
    } catch (error) {
      logger.error('MongoDB Health Check Failed', { error: error.message })
      return false
    }
  }
}

export default MongoDBService

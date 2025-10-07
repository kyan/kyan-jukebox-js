import {
  JBUser,
  JBTrack,
  JBAddedBy,
  DatabaseResult,
  PaginationOptions,
  QueryOptions,
  DatabaseConfig,
  MongoDBConfig,
  SQLiteConfig
} from '../../types/database'
import Mopidy from 'mopidy'

// User Service Interface
export interface IUserService {
  findById(id: string): Promise<JBUser | null>
  findByEmail(email: string): Promise<JBUser | null>
  create(userData: Omit<JBUser, '_id'>): Promise<JBUser>
  update(id: string, updates: Partial<JBUser>): Promise<JBUser | null>
  delete(id: string): Promise<boolean>
  findOrCreateBRH(): Promise<JBUser>
}

// Track Service Interface
export interface ITrackService {
  findByUri(uri: string): Promise<JBTrack | null>
  findByUris(uris: string[]): Promise<JBTrack[]>
  addTracks(uris: string[], user?: JBUser): Promise<{ uris: string[]; user: JBUser }>
  updatePlaycount(uri: string): Promise<JBTrack | null>
  updateVote(
    uri: string,
    user: JBUser,
    vote: number
  ): Promise<{
    uri: string
    addedBy: JBAddedBy[]
    metrics: any
  }>
  getTrackMetrics(uri: string): Promise<any | null>
  bulkCreate(tracks: Partial<JBTrack>[]): Promise<JBTrack[]>
  findTracksWithLowVotes(trackUris: string[]): Promise<string[]>
  findTracksPlayedToday(): Promise<string[]>
  findRandomTracksWithHighVotes(limit: number): Promise<string[]>
}

// Setting Service Interface
export interface ISettingService {
  clearState(): Promise<void>
  initializeState(
    currentTrack: Mopidy.models.Track | null,
    currentTracklist: Mopidy.models.Track[]
  ): Promise<void>
  addToTrackSeedList(track: JBTrack): Promise<void | string>
  trimTracklist(mopidy: Mopidy): Promise<boolean>
  updateCurrentTrack(uri: string): Promise<string>
  updateTracklist(uris: string[]): Promise<string[]>
  removeFromSeeds(uri: string): Promise<string>
  getSeedTracks(): Promise<string[]>
  getTracklist(): Promise<string[]>
  getPlayedTracksFromTracklist(): Promise<string[]>
  getCurrentTrack(): Promise<string | null>
  updateJsonSetting(key: string, value: any): Promise<void>
}

// Event Service Interface
export interface IEventService {
  create(eventData: { user: string; key: string; payload: any }): Promise<void>
  findByUser(userId: string, options?: QueryOptions): Promise<any[]>
  findByKey(key: string, options?: QueryOptions): Promise<any[]>
  findRecent(limit?: number): Promise<any[]>
  deleteOld(beforeDate: Date): Promise<number>
}

// Image Service Interface
export interface IImageService {
  findByUri(uri: string): Promise<{ _id: string; url: string; expireAt: Date } | null>
  findByUris(uris: string[]): Promise<{ _id: string; url: string; expireAt: Date }[]>
  store(uri: string, url: string): Promise<void>
  storeMany(imageData: Record<string, string>): Promise<void>
  deleteExpired(): Promise<number>
  updateExpiration(uri: string, expireAt: Date): Promise<void>
}

// Main Database Service Interface
export interface IDatabaseService {
  users: IUserService
  tracks: ITrackService
  settings: ISettingService
  events: IEventService
  images: IImageService

  // Connection management
  connect(): Promise<void>
  disconnect(): Promise<void>
  isConnected(): boolean

  // Transaction support
  transaction<T>(callback: () => Promise<T>): Promise<T>

  // Health checks
  healthCheck(): Promise<boolean>
}

// Re-export configuration interfaces from shared types
export type {
  DatabaseConfig,
  MongoDBConfig,
  SQLiteConfig,
  DatabaseResult,
  PaginationOptions,
  QueryOptions
}

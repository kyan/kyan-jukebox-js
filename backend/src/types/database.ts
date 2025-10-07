/**
 * Shared Database Types
 *
 * This file contains all the core database-related type definitions used throughout
 * the application. It serves as the single source of truth for data structure types,
 * ensuring consistency across all layers of the application.
 *
 * These types are implementation-agnostic and can be used with any database service
 * (MongoDB, SQLite, etc.) while maintaining type safety and consistency.
 */

import Mopidy from 'mopidy'

// ============================================================================
// User Types
// ============================================================================

export interface JBUser {
  _id: any
  fullname: string
  email: string
}

// ============================================================================
// Track Types
// ============================================================================

export interface JBVotes {
  user: JBUser
  vote: number
  at: Date
}

export interface JBPlayed {
  at: Date
}

export interface JBAddedBy {
  user: JBUser
  addedAt: Date
  played: JBPlayed[]
  votes: JBVotes[]
}

export interface JBMetrics {
  plays: number
  votes: number
  votesTotal: number
  votesAverage: number
}

export interface JBAlbum {
  uri: string
  name: string
  year?: string
}

export interface JBArtist {
  uri: string
  name: string
}

export interface JBTrack {
  uri: string
  name: string
  length: number
  year?: string
  image?: string
  album?: JBAlbum
  artist?: JBArtist
  addedBy?: JBAddedBy[]
  metrics?: JBMetrics
  explicit?: boolean
  genres?: string[]
}

// Extended types for Spotify integration
export interface SpotifyTrackObjectFullExt extends SpotifyApi.TrackObjectFull {
  addedBy: JBAddedBy[]
  metrics: JBMetrics
}

export interface MopidyImageExt extends Mopidy.models.Image {
  url: string
}

export interface MopidyAlbumExt extends Mopidy.models.Album {
  images: MopidyImageExt[]
}

export interface MopidyTrackExt extends Mopidy.models.Track {
  album: MopidyAlbumExt
  addedBy?: JBAddedBy[]
  metrics?: JBMetrics
  image?: string
  genres?: string[]
  duration_ms?: number
  explicit?: boolean
}

// Wrapper types
export interface JBWTrack {
  track: JBTrack
}

// ============================================================================
// Setting Types
// ============================================================================

export interface JBSettingValue {
  trackSeeds: string[]
  currentTrack: string | null
  currentTracklist: string[]
}

export interface JBSetting {
  key: string
  value: JBSettingValue
}

// ============================================================================
// Event Types
// ============================================================================

export interface JBEvent {
  _id?: any
  user: string
  key: string
  payload: any
  createdAt?: Date
}

// ============================================================================
// Image Cache Types
// ============================================================================

export interface JBImage {
  _id: string
  url: string
  expireAt: Date
}

// ============================================================================
// Common Database Operation Types
// ============================================================================

export interface DatabaseResult<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginationOptions {
  limit?: number
  offset?: number
}

export interface QueryOptions {
  populate?: string[]
  sort?: Record<string, 1 | -1>
  pagination?: PaginationOptions
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface DatabaseConfig {
  type: 'mongodb' | 'sqlite'
  connectionString?: string
  options?: Record<string, any>
}

export interface MongoDBConfig extends DatabaseConfig {
  type: 'mongodb'
  connectionString: string
  options?: {
    maxPoolSize?: number
  }
}

export interface SQLiteConfig extends DatabaseConfig {
  type: 'sqlite'
  connectionString: string // file path for SQLite
  options?: {
    enableWAL?: boolean
    timeout?: number
  }
}

// ============================================================================
// Utility Types
// ============================================================================

// Type for payload structures used in socket communication
export interface JBPayload {
  key: string
  data: any
  user?: Partial<JBUser>
}

// Type for search results
export interface JBSearchResults {
  limit: number
  offset: number
  total: number
  tracks: JBTrack[]
}

// Type for vote handler operations
export interface JBVoteResult {
  uri: string
  addedBy: JBAddedBy[]
  metrics: JBMetrics
}

// Type for track addition operations
export interface JBTrackAddResult {
  uris: string[]
  user: JBUser
}

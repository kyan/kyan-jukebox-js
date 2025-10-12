import {
  IDatabaseService,
  IUserService,
  ITrackService,
  ISettingService,
  IEventService,
  IImageService,
  SQLiteConfig,
  QueryOptions
} from './interfaces'
import { JBUser, JBTrack, JBAddedBy } from '../../types/database'
import Database from 'better-sqlite3'
import logger from '../../config/logger'
import VotingHelper from '../../utils/voting'
import Mopidy from 'mopidy'
import path from 'path'
import fs from 'fs'
import { JBPlayed, JBVotes } from '../../types/database'

class SQLiteUserService implements IUserService {
  constructor(private db: Database.Database) {}

  async findById(id: string): Promise<JBUser | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?')
      const row = stmt.get(id) as any

      if (!row) return null

      return {
        _id: row.id,
        fullname: row.fullname,
        email: row.email
      }
    } catch (error) {
      logger.error('SQLiteUserService.findById error', { error: error.message, id })
      throw error
    }
  }

  async findByEmail(email: string): Promise<JBUser | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?')
      const row = stmt.get(email) as any

      if (!row) return null

      return {
        _id: row.id,
        fullname: row.fullname,
        email: row.email
      }
    } catch (error) {
      logger.error('SQLiteUserService.findByEmail error', { error: error.message, email })
      throw error
    }
  }

  async create(userData: Omit<JBUser, '_id'>): Promise<JBUser> {
    try {
      const id = new Date().getTime().toString() + Math.random().toString(36).substr(2, 9)
      const stmt = this.db.prepare(`
        INSERT INTO users (id, fullname, email)
        VALUES (?, ?, ?)
      `)

      stmt.run(id, userData.fullname, userData.email)

      return {
        _id: id,
        fullname: userData.fullname,
        email: userData.email
      }
    } catch (error) {
      logger.error('SQLiteUserService.create error', { error: error.message, userData })
      throw error
    }
  }

  async update(id: string, updates: Partial<JBUser>): Promise<JBUser | null> {
    try {
      const setClauses: string[] = []
      const values: any[] = []

      if (updates.fullname !== undefined) {
        setClauses.push('fullname = ?')
        values.push(updates.fullname)
      }

      if (updates.email !== undefined) {
        setClauses.push('email = ?')
        values.push(updates.email)
      }

      if (setClauses.length === 0) {
        return this.findById(id)
      }

      values.push(id)

      const stmt = this.db.prepare(`
        UPDATE users
        SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      const result = stmt.run(...values)

      if (result.changes === 0) return null

      return this.findById(id)
    } catch (error) {
      logger.error('SQLiteUserService.update error', {
        error: error.message,
        id,
        updates
      })
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const stmt = this.db.prepare('DELETE FROM users WHERE id = ?')
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      logger.error('SQLiteUserService.delete error', { error: error.message, id })
      throw error
    }
  }

  async findOrCreateBRH(): Promise<JBUser> {
    try {
      // First try to find existing BRH user
      const brhUser = await this.findByEmail('brh@kyan.com')
      if (brhUser) {
        return brhUser
      }

      // Create BRH user if it doesn't exist (this should not happen as it's in schema)
      return this.create({
        fullname: 'Big Red Head',
        email: 'brh@kyan.com'
      })
    } catch (error) {
      logger.error('SQLiteUserService.findOrCreateBRH error', { error: error.message })
      throw error
    }
  }
}

class SQLiteTrackService implements ITrackService {
  constructor(private db: Database.Database) {}

  async findByUri(uri: string): Promise<JBTrack | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM tracks WHERE uri = ?')
      const row = stmt.get(uri) as any

      if (!row) return null

      return this.convertRowToTrack(row)
    } catch (error) {
      logger.error('SQLiteTrackService.findByUri error', { error: error.message, uri })
      throw error
    }
  }

  async findByUris(uris: string[]): Promise<JBTrack[]> {
    try {
      if (uris.length === 0) return []

      const placeholders = uris.map(() => '?').join(',')
      const stmt = this.db.prepare(`SELECT * FROM tracks WHERE uri IN (${placeholders})`)
      const rows = stmt.all(...uris) as any[]

      return rows.map((row) => this.convertRowToTrack(row))
    } catch (error) {
      logger.error('SQLiteTrackService.findByUris error', { error: error.message, uris })
      throw error
    }
  }

  async addTracks(
    uris: string[],
    user?: JBUser
  ): Promise<{ uris: string[]; user: JBUser }> {
    try {
      const userService = new SQLiteUserService(this.db)
      const effectiveUser = user || (await userService.findOrCreateBRH())

      // This is a simplified implementation - in a real scenario, you'd fetch track data from Spotify/Mopidy
      // For now, we'll just ensure the tracks exist with basic data
      const insertStmt = this.db.prepare(`
        INSERT OR IGNORE INTO tracks (uri, name, length, added_by, metrics)
        VALUES (?, ?, ?, ?, ?)
      `)

      const updateStmt = this.db.prepare(`
        UPDATE tracks
        SET added_by = json_insert(added_by, '$[#]', json(?))
        WHERE uri = ? AND json_extract(added_by, '$') NOT LIKE '%' || ? || '%'
      `)

      for (const uri of uris) {
        const addedByEntry = {
          user: effectiveUser,
          addedAt: new Date().toISOString(),
          played: [] as JBPlayed[],
          votes: [] as JBVotes[]
        }

        const defaultMetrics = {
          plays: 0,
          votes: 0,
          votesTotal: 0,
          votesAverage: 0
        }

        // Try to insert new track
        insertStmt.run(
          uri,
          `Track ${uri}`, // Default name - should be replaced with real data
          0, // Default length
          JSON.stringify([addedByEntry]),
          JSON.stringify(defaultMetrics)
        )

        // Update existing track's addedBy if user hasn't added it before
        updateStmt.run(JSON.stringify(addedByEntry), uri, effectiveUser._id)
      }

      return { uris, user: effectiveUser }
    } catch (error) {
      logger.error('SQLiteTrackService.addTracks error', {
        error: error.message,
        uris,
        user
      })
      throw error
    }
  }

  async updatePlaycount(uri: string): Promise<JBTrack | null> {
    try {
      const track = await this.findByUri(uri)
      if (!track || !track.addedBy || track.addedBy.length === 0) {
        return null
      }

      const played = { at: new Date() }
      track.addedBy[0].played.unshift(played)
      track.metrics = track.metrics || {
        plays: 0,
        votes: 0,
        votesTotal: 0,
        votesAverage: 0
      }
      track.metrics.plays = track.metrics.plays + 1

      const stmt = this.db.prepare(`
        UPDATE tracks
        SET added_by = ?, metrics = ?, updated_at = CURRENT_TIMESTAMP
        WHERE uri = ?
      `)

      stmt.run(JSON.stringify(track.addedBy), JSON.stringify(track.metrics), uri)

      return track
    } catch (error) {
      logger.error('SQLiteTrackService.updatePlaycount error', {
        error: error.message,
        uri
      })
      throw error
    }
  }

  async updateVote(
    uri: string,
    user: JBUser,
    vote: number
  ): Promise<{ uri: string; addedBy: JBAddedBy[]; metrics: any }> {
    try {
      const track = await this.findByUri(uri)
      if (!track || !track.addedBy || track.addedBy.length === 0) {
        throw new Error('Track not found or invalid')
      }

      const currentVote = vote * 10 // VotingHelper.voteNormalised equivalent
      const newVote = {
        at: new Date(),
        vote: currentVote,
        user: user
      }

      const votes = track.addedBy[0].votes
      const currentVoteIndex = votes.findIndex((v: any) => v.user._id === user._id)

      if (currentVoteIndex !== -1) {
        votes[currentVoteIndex].vote = currentVote
      } else {
        votes.unshift(newVote)
        track.metrics.votes = VotingHelper.calcVoteCount(track.addedBy)
      }

      track.metrics.votesTotal = VotingHelper.calcVoteTotal(track.addedBy)
      track.metrics.votesAverage = VotingHelper.calcWeightedMean(track.addedBy)

      const stmt = this.db.prepare(`
        UPDATE tracks
        SET added_by = ?, metrics = ?, updated_at = CURRENT_TIMESTAMP
        WHERE uri = ?
      `)

      stmt.run(JSON.stringify(track.addedBy), JSON.stringify(track.metrics), uri)

      return {
        uri: track.uri,
        addedBy: track.addedBy,
        metrics: track.metrics
      }
    } catch (error) {
      logger.error('SQLiteTrackService.updateVote error', {
        error: error.message,
        uri,
        user,
        vote
      })
      throw error
    }
  }

  async getTrackMetrics(uri: string): Promise<any | null> {
    try {
      const stmt = this.db.prepare('SELECT metrics FROM tracks WHERE uri = ?')
      const row = stmt.get(uri) as any

      if (!row) return null

      return JSON.parse(row.metrics)
    } catch (error) {
      logger.error('SQLiteTrackService.getTrackMetrics error', {
        error: error.message,
        uri
      })
      throw error
    }
  }

  async bulkCreate(tracks: Partial<JBTrack>[]): Promise<JBTrack[]> {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO tracks
        (uri, name, length, year, image, album, artist, added_by, metrics, explicit, genres)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      const transaction = this.db.transaction((tracksToInsert: Partial<JBTrack>[]) => {
        for (const track of tracksToInsert) {
          stmt.run(
            track.uri,
            track.name || '',
            track.length || 0,
            track.year || null,
            track.image || null,
            track.album ? JSON.stringify(track.album) : null,
            track.artist ? JSON.stringify(track.artist) : null,
            track.addedBy ? JSON.stringify(track.addedBy) : JSON.stringify([]),
            track.metrics
              ? JSON.stringify(track.metrics)
              : JSON.stringify({ plays: 0, votes: 0, votesTotal: 0, votesAverage: 0 }),
            track.explicit ? 1 : 0,
            track.genres ? JSON.stringify(track.genres) : JSON.stringify([])
          )
        }
      })

      transaction(tracks)

      // Return the created tracks
      const uris = tracks.map((t) => t.uri).filter(Boolean) as string[]
      return this.findByUris(uris)
    } catch (error) {
      logger.error('SQLiteTrackService.bulkCreate error', {
        error: error.message,
        trackCount: tracks.length
      })
      throw error
    }
  }

  async findTracksWithLowVotes(trackUris: string[]): Promise<string[]> {
    try {
      if (trackUris.length === 0) return []

      const placeholders = trackUris.map(() => '?').join(',')
      const stmt = this.db.prepare(`
        SELECT uri FROM tracks
        WHERE uri IN (${placeholders})
        AND json_extract(metrics, '$.votesAverage') < 50
        AND json_extract(metrics, '$.votes') > 0
      `)

      const rows = stmt.all(...trackUris) as any[]
      return rows.map((row) => row.uri)
    } catch (error) {
      logger.error('SQLiteTrackService.findTracksWithLowVotes error', {
        error: error.message,
        trackUris
      })
      throw error
    }
  }

  async findTracksPlayedToday(): Promise<string[]> {
    try {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      const stmt = this.db.prepare(`
        SELECT uri FROM tracks
        WHERE created_at > ?
      `)

      const rows = stmt.all(startOfToday.toISOString()) as any[]
      return rows.map((row) => row.uri)
    } catch (error) {
      logger.error('SQLiteTrackService.findTracksPlayedToday error', {
        error: error.message
      })
      throw error
    }
  }

  async findRandomTracksWithHighVotes(limit: number): Promise<string[]> {
    try {
      const stmt = this.db.prepare(`
        SELECT uri FROM tracks
        WHERE json_extract(metrics, '$.votesAverage') >= 70
        ORDER BY RANDOM()
        LIMIT ?
      `)

      const rows = stmt.all(limit) as any[]
      return rows.map((row) => row.uri)
    } catch (error) {
      logger.error('SQLiteTrackService.findRandomTracksWithHighVotes error', {
        error: error.message,
        limit
      })
      throw error
    }
  }

  private convertRowToTrack(row: any): JBTrack {
    const addedBy = row.added_by ? JSON.parse(row.added_by) : []

    // Convert date strings back to Date objects and populate user info
    const processedAddedBy = addedBy.map((entry: any) => {
      let user = entry.user

      // If user exists but has empty fullname, try to populate from users table
      if (user && user._id && (!user.fullname || user.fullname === '')) {
        try {
          const userStmt = this.db.prepare('SELECT * FROM users WHERE id = ?')
          const userRow = userStmt.get(user._id) as any

          if (userRow) {
            user = {
              _id: userRow.id,
              fullname: userRow.fullname,
              email: userRow.email
            }
          }
        } catch (error) {
          logger.error('Failed to populate user data for track', {
            userId: user._id,
            error: error.message
          })
        }
      }

      return {
        ...entry,
        user,
        addedAt: entry.addedAt ? new Date(entry.addedAt) : entry.addedAt,
        played: entry.played
          ? entry.played.map((p: any) => ({
              ...p,
              at: p.at ? new Date(p.at) : p.at
            }))
          : [],
        votes: entry.votes
          ? entry.votes.map((v: any) => {
              let voteUser = v.user

              // If vote user exists but has empty fullname, populate from users table
              if (
                voteUser &&
                voteUser._id &&
                (!voteUser.fullname || voteUser.fullname === '')
              ) {
                try {
                  const userStmt = this.db.prepare('SELECT * FROM users WHERE id = ?')
                  const userRow = userStmt.get(voteUser._id) as any

                  if (userRow) {
                    voteUser = {
                      _id: userRow.id,
                      fullname: userRow.fullname,
                      email: userRow.email
                    }
                  }
                } catch (error) {
                  logger.error('Failed to populate vote user data for track', {
                    userId: voteUser._id,
                    error: error.message
                  })
                }
              }

              return {
                ...v,
                user: voteUser,
                at: v.at ? new Date(v.at) : v.at
              }
            })
          : []
      }
    })

    return {
      uri: row.uri,
      name: row.name,
      length: row.length,
      year: row.year,
      image: row.image,
      album: row.album ? JSON.parse(row.album) : undefined,
      artist: row.artist ? JSON.parse(row.artist) : undefined,
      addedBy: processedAddedBy,
      metrics: row.metrics
        ? JSON.parse(row.metrics)
        : { plays: 0, votes: 0, votesTotal: 0, votesAverage: 0 },
      explicit: row.explicit,
      genres: row.genres ? JSON.parse(row.genres) : []
    }
  }
}

class SQLiteSettingService implements ISettingService {
  constructor(private db: Database.Database) {}

  private readonly stateKey = 'state'
  private readonly HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST = 4 as const

  async clearState(): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `)

      const defaultValue = {
        trackSeeds: [] as string[],
        currentTrack: null as string | null,
        currentTracklist: [] as string[]
      }

      stmt.run(this.stateKey, JSON.stringify(defaultValue))
    } catch (error) {
      logger.error('SQLiteSettingService.clearState error', { error: error.message })
      throw error
    }
  }

  async initializeState(
    currentTrack: Mopidy.models.Track | null,
    currentTracklist: Mopidy.models.Track[]
  ): Promise<void> {
    try {
      const value = {
        currentTrack: currentTrack ? currentTrack.uri : null,
        currentTracklist: currentTracklist.map((track) => track.uri),
        trackSeeds: [] as string[]
      }

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `)

      stmt.run(this.stateKey, JSON.stringify(value))
    } catch (error) {
      logger.error('SQLiteSettingService.initializeState error', { error: error.message })
      throw error
    }
  }

  async addToTrackSeedList(track: JBTrack): Promise<void | string> {
    try {
      if (track.metrics && track.metrics.votes > 1 && track.metrics.votesAverage < 50) {
        return Promise.resolve()
      }
      if (track.metrics && track.metrics.plays > 2 && track.metrics.votes < 1) {
        return Promise.resolve()
      }

      const state = await this.getState()
      if (state) {
        const seeds = new Set(state.trackSeeds)
        seeds.add(track.uri)
        state.trackSeeds = Array.from(seeds)

        const stmt = this.db.prepare(`
          UPDATE settings
          SET value = ?, updated_at = CURRENT_TIMESTAMP
          WHERE key = ?
        `)

        stmt.run(JSON.stringify(state), this.stateKey)
        return track.uri
      }
    } catch (error) {
      logger.error('SQLiteSettingService.addToTrackSeedList error', {
        error: error.message,
        track
      })
      throw error
    }
  }

  async trimTracklist(mopidy: Mopidy): Promise<boolean> {
    try {
      const state = await this.getState()
      if (state) {
        const { currentTrack, currentTracklist } = state
        const currentTrackIndex = currentTracklist.indexOf(currentTrack)

        if (currentTrackIndex > this.HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST) {
          const indexToDeleteTo =
            currentTrackIndex - this.HOW_MANY_PREVIOUS_TRACKS_IN_PLAYLIST
          const tracksToTrim = currentTracklist.slice(0, indexToDeleteTo)
          state.currentTracklist = currentTracklist.slice(indexToDeleteTo)

          const stmt = this.db.prepare(`
            UPDATE settings
            SET value = ?, updated_at = CURRENT_TIMESTAMP
            WHERE key = ?
          `)

          stmt.run(JSON.stringify(state), this.stateKey)

          logger.info('trimTracklist', { args: tracksToTrim })
          await mopidy.tracklist.remove({ criteria: { uri: tracksToTrim } })
          return true
        }
      }
      return false
    } catch (error) {
      logger.error('SQLiteSettingService.trimTracklist error', { error: error.message })
      throw error
    }
  }

  async updateCurrentTrack(uri: string): Promise<string> {
    try {
      const state = (await this.getState()) || this.getDefaultState()
      state.currentTrack = uri

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `)

      stmt.run(this.stateKey, JSON.stringify(state))
      return uri
    } catch (error) {
      logger.error('SQLiteSettingService.updateCurrentTrack error', {
        error: error.message,
        uri
      })
      throw error
    }
  }

  async updateTracklist(uris: string[]): Promise<string[]> {
    try {
      const state = (await this.getState()) || this.getDefaultState()
      state.currentTracklist = uris

      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `)

      stmt.run(this.stateKey, JSON.stringify(state))
      return uris
    } catch (error) {
      logger.error('SQLiteSettingService.updateTracklist error', {
        error: error.message,
        uris
      })
      throw error
    }
  }

  async removeFromSeeds(uri: string): Promise<string> {
    try {
      const state = await this.getState()
      if (state) {
        state.trackSeeds = state.trackSeeds.filter((seed: string) => seed !== uri)

        const stmt = this.db.prepare(`
          UPDATE settings
          SET value = ?, updated_at = CURRENT_TIMESTAMP
          WHERE key = ?
        `)

        stmt.run(JSON.stringify(state), this.stateKey)
      }
      return uri
    } catch (error) {
      logger.error('SQLiteSettingService.removeFromSeeds error', {
        error: error.message,
        uri
      })
      throw error
    }
  }

  async getSeedTracks(): Promise<string[]> {
    try {
      const state = await this.getState()
      return state?.trackSeeds || []
    } catch (error) {
      logger.error('SQLiteSettingService.getSeedTracks error', { error: error.message })
      return []
    }
  }

  async getTracklist(): Promise<string[]> {
    try {
      const state = await this.getState()
      return state?.currentTracklist || []
    } catch (error) {
      logger.error('SQLiteSettingService.getTracklist error', { error: error.message })
      return []
    }
  }

  async getPlayedTracksFromTracklist(): Promise<string[]> {
    try {
      const state = await this.getState()
      if (!state) return []

      const track = state.currentTrack
      const tracklist = state.currentTracklist || []

      if (!track) return []

      const currentIndex = tracklist.indexOf(track)
      return currentIndex > 0 ? tracklist.slice(0, currentIndex) : []
    } catch (error) {
      logger.error('SQLiteSettingService.getPlayedTracksFromTracklist error', {
        error: error.message
      })
      return []
    }
  }

  async getCurrentTrack(): Promise<string | null> {
    try {
      const state = await this.getState()
      return state?.currentTrack || null
    } catch (error) {
      logger.error('SQLiteSettingService.getCurrentTrack error', { error: error.message })
      return null
    }
  }

  async updateJsonSetting(key: string, value: any): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?, ?)
      `)

      stmt.run(key, JSON.stringify(value))
    } catch (error) {
      logger.error('SQLiteSettingService.updateJsonSetting error', {
        error: error.message,
        key,
        value
      })
      throw error
    }
  }

  private async getState(): Promise<any | null> {
    try {
      const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?')
      const row = stmt.get(this.stateKey) as any

      if (!row) return null

      return JSON.parse(row.value)
    } catch (error) {
      logger.error('SQLiteSettingService.getState error', { error: error.message })
      return null
    }
  }

  private getDefaultState(): any {
    return {
      trackSeeds: [] as string[],
      currentTrack: null as string | null,
      currentTracklist: [] as string[]
    }
  }
}

class SQLiteEventService implements IEventService {
  constructor(private db: Database.Database) {}

  async create(eventData: { user: string; key: string; payload: any }): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO events (user_id, key, payload)
        VALUES (?, ?, ?)
      `)

      stmt.run(eventData.user, eventData.key, JSON.stringify(eventData.payload))
    } catch (error) {
      logger.error('SQLiteEventService.create error', { error: error.message, eventData })
      throw error
    }
  }

  async findByUser(userId: string, options?: QueryOptions): Promise<any[]> {
    try {
      let query = 'SELECT * FROM events WHERE user_id = ?'
      const params: any[] = [userId]

      if (options?.sort) {
        const sortClauses = Object.entries(options.sort).map(([field, direction]) => {
          const dir = direction === 1 ? 'ASC' : 'DESC'
          // Map _id to id for SQLite
          const sqliteField = field === '_id' ? 'id' : field
          return `${sqliteField} ${dir}`
        })
        query += ` ORDER BY ${sortClauses.join(', ')}`
      }

      if (options?.pagination) {
        if (options.pagination.limit) {
          query += ' LIMIT ?'
          params.push(options.pagination.limit)
        }
        if (options.pagination.offset) {
          query += ' OFFSET ?'
          params.push(options.pagination.offset)
        }
      }

      const stmt = this.db.prepare(query)
      const rows = stmt.all(...params) as any[]

      return rows.map((row) => ({
        _id: row.id,
        user: row.user_id,
        key: row.key,
        payload: JSON.parse(row.payload),
        createdAt: new Date(row.created_at)
      }))
    } catch (error) {
      logger.error('SQLiteEventService.findByUser error', {
        error: error.message,
        userId,
        options
      })
      throw error
    }
  }

  async findByKey(key: string, options?: QueryOptions): Promise<any[]> {
    try {
      let query = 'SELECT * FROM events WHERE key = ?'
      const params: any[] = [key]

      if (options?.sort) {
        const sortClauses = Object.entries(options.sort).map(([field, direction]) => {
          const dir = direction === 1 ? 'ASC' : 'DESC'
          const sqliteField = field === '_id' ? 'id' : field
          return `${sqliteField} ${dir}`
        })
        query += ` ORDER BY ${sortClauses.join(', ')}`
      }

      if (options?.pagination) {
        if (options.pagination.limit) {
          query += ' LIMIT ?'
          params.push(options.pagination.limit)
        }
        if (options.pagination.offset) {
          query += ' OFFSET ?'
          params.push(options.pagination.offset)
        }
      }

      const stmt = this.db.prepare(query)
      const rows = stmt.all(...params) as any[]

      return rows.map((row) => ({
        _id: row.id,
        user: row.user_id,
        key: row.key,
        payload: JSON.parse(row.payload),
        createdAt: new Date(row.created_at)
      }))
    } catch (error) {
      logger.error('SQLiteEventService.findByKey error', {
        error: error.message,
        key,
        options
      })
      throw error
    }
  }

  async findRecent(limit: number = 100): Promise<any[]> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM events
        ORDER BY id DESC
        LIMIT ?
      `)

      const rows = stmt.all(limit) as any[]

      return rows.map((row) => ({
        _id: row.id,
        user: row.user_id,
        key: row.key,
        payload: JSON.parse(row.payload),
        createdAt: new Date(row.created_at)
      }))
    } catch (error) {
      logger.error('SQLiteEventService.findRecent error', { error: error.message, limit })
      throw error
    }
  }

  async deleteOld(beforeDate: Date): Promise<number> {
    try {
      const stmt = this.db.prepare('DELETE FROM events WHERE created_at < ?')
      const result = stmt.run(beforeDate.toISOString())
      return result.changes
    } catch (error) {
      logger.error('SQLiteEventService.deleteOld error', {
        error: error.message,
        beforeDate
      })
      throw error
    }
  }
}

class SQLiteImageService implements IImageService {
  constructor(private db: Database.Database) {}

  async findByUri(
    uri: string
  ): Promise<{ _id: string; url: string; expireAt: Date } | null> {
    try {
      const stmt = this.db.prepare('SELECT * FROM images WHERE uri = ?')
      const row = stmt.get(uri) as any

      if (!row) return null

      return {
        _id: row.uri,
        url: row.url,
        expireAt: new Date(row.expire_at)
      }
    } catch (error) {
      logger.error('SQLiteImageService.findByUri error', { error: error.message, uri })
      throw error
    }
  }

  async findByUris(
    uris: string[]
  ): Promise<{ _id: string; url: string; expireAt: Date }[]> {
    try {
      if (uris.length === 0) return []

      const placeholders = uris.map(() => '?').join(',')
      const stmt = this.db.prepare(`SELECT * FROM images WHERE uri IN (${placeholders})`)
      const rows = stmt.all(...uris) as any[]

      return rows.map((row) => ({
        _id: row.uri,
        url: row.url,
        expireAt: new Date(row.expire_at)
      }))
    } catch (error) {
      logger.error('SQLiteImageService.findByUris error', { error: error.message, uris })
      throw error
    }
  }

  async store(uri: string, url: string): Promise<void> {
    try {
      const expireAt = this.calculateExpiration()
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO images (uri, url, expire_at)
        VALUES (?, ?, ?)
      `)

      stmt.run(uri, url, expireAt.toISOString())
    } catch (error) {
      logger.error('SQLiteImageService.store error', { error: error.message, uri, url })
      throw error
    }
  }

  async storeMany(imageData: Record<string, string>): Promise<void> {
    try {
      const expireAt = this.calculateExpiration()
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO images (uri, url, expire_at)
        VALUES (?, ?, ?)
      `)

      const transaction = this.db.transaction((images: Record<string, string>) => {
        Object.entries(images).forEach(([uri, url]) => {
          stmt.run(uri, url, expireAt.toISOString())
        })
      })

      transaction(imageData)
    } catch (error) {
      logger.error('SQLiteImageService.storeMany error', {
        error: error.message,
        imageCount: Object.keys(imageData).length
      })
      throw error
    }
  }

  async deleteExpired(): Promise<number> {
    try {
      const stmt = this.db.prepare('DELETE FROM images WHERE expire_at < ?')
      const result = stmt.run(new Date().toISOString())
      return result.changes
    } catch (error) {
      logger.error('SQLiteImageService.deleteExpired error', { error: error.message })
      throw error
    }
  }

  async updateExpiration(uri: string, expireAt: Date): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        UPDATE images
        SET expire_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE uri = ?
      `)

      stmt.run(expireAt.toISOString(), uri)
    } catch (error) {
      logger.error('SQLiteImageService.updateExpiration error', {
        error: error.message,
        uri,
        expireAt
      })
      throw error
    }
  }

  private calculateExpiration(): Date {
    const day = 12 * 3600 * 1000
    const today = new Date()
    return new Date(today.getTime() + day * 30)
  }
}

export class SQLiteService implements IDatabaseService {
  public users: IUserService
  public tracks: ITrackService
  public settings: ISettingService
  public events: IEventService
  public images: IImageService

  private config: SQLiteConfig
  private db: Database.Database | null = null
  private connected: boolean = false

  constructor(config: SQLiteConfig) {
    this.config = config

    // Initialize services - they will be properly connected when connect() is called
    this.users = new SQLiteUserService(this.db as any)
    this.tracks = new SQLiteTrackService(this.db as any)
    this.settings = new SQLiteSettingService(this.db as any)
    this.events = new SQLiteEventService(this.db as any)
    this.images = new SQLiteImageService(this.db as any)
  }

  async connect(): Promise<void> {
    try {
      // Ensure the database directory exists
      const dbPath = path.resolve(this.config.connectionString)
      const dbDir = path.dirname(dbPath)

      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
      }

      // Create database connection
      this.db = new Database(dbPath)

      // Configure SQLite pragmas
      this.configurePragmas()

      // Reinitialize services with the connected database
      this.users = new SQLiteUserService(this.db)
      this.tracks = new SQLiteTrackService(this.db)
      this.settings = new SQLiteSettingService(this.db)
      this.events = new SQLiteEventService(this.db)
      this.images = new SQLiteImageService(this.db)

      this.connected = true
      logger.info('SQLite Connected', { path: dbPath })
    } catch (error) {
      this.connected = false
      logger.error('SQLite Connection Failed', { error: error.message })
      throw new Error('SQLite failed to connect!')
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected && this.db) {
      try {
        this.db.close()
        this.db = null
        this.connected = false
        logger.info('SQLite Disconnected')
      } catch (error) {
        logger.error('SQLite Disconnect Failed', { error: error.message })
        throw error
      }
    }
  }

  isConnected(): boolean {
    return this.connected && this.db !== null && this.db.open
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected')
    }

    // better-sqlite3 transactions must be synchronous
    // For now, we'll execute the callback without transaction wrapping
    // In a production system, you'd need to restructure to use sync operations
    return await callback()
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected() || !this.db) {
        return false
      }

      // Simple query to verify connection
      const stmt = this.db.prepare('SELECT 1 as test')
      const result = stmt.get()
      return result !== undefined
    } catch (error) {
      logger.error('SQLite Health Check Failed', { error: error.message })
      return false
    }
  }

  private configurePragmas(): void {
    if (!this.db) return

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON')

    // Configure performance settings based on config
    if (this.config.options?.enableWAL) {
      this.db.pragma('journal_mode = WAL')
    }

    this.db.pragma('synchronous = NORMAL')
    this.db.pragma('cache_size = 10000')
    this.db.pragma('temp_store = memory')

    // Set timeout if specified
    if (this.config.options?.timeout) {
      // Note: better-sqlite3 doesn't have a timeout method like sqlite3
      // Timeout is handled during connection opening
    }
  }
}

export default SQLiteService

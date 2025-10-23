import { expect, test, beforeAll, afterAll, describe } from 'bun:test'
import { SQLiteService } from '../../src/services/database/sqlite-service'
import { SQLiteConfig } from '../../src/services/database/interfaces'
import { initializeSQLiteDatabase } from '../../src/services/database/sqlite/schema-runner'
import path from 'path'
import fs from 'fs'
import { JBUser, JBTrack } from '../../src/types/database'

describe('SQLiteService', () => {
  let service: SQLiteService
  let testDbPath: string
  const config: SQLiteConfig = {
    type: 'sqlite',
    connectionString: '',
    options: {
      enableWAL: true,
      timeout: 5000
    }
  }

  beforeAll(async () => {
    // Create a temporary test database
    testDbPath = path.join(__dirname, '../../../databases/test-sqlite-service.db')
    config.connectionString = testDbPath

    // Ensure database directory exists
    const dbDir = path.dirname(testDbPath)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    // Remove existing test database
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }

    // Initialize database schema
    await initializeSQLiteDatabase(testDbPath)

    // Create service instance
    service = new SQLiteService(config)
    await service.connect()
  })

  afterAll(async () => {
    // Cleanup
    if (service && service.isConnected()) {
      await service.disconnect()
    }
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  describe('Connection Management', () => {
    test('should connect successfully', () => {
      expect(service.isConnected()).toBe(true)
    })

    test('should pass health check', async () => {
      const isHealthy = await service.healthCheck()
      expect(isHealthy).toBe(true)
    })
  })

  describe('User Service', () => {
    let testUser: JBUser

    test('should create a user', async () => {
      const userData = {
        fullname: 'Test User',
        email: 'test@example.com'
      }

      testUser = await service.users.create(userData)

      expect(testUser).toBeDefined()
      expect(testUser._id).toBeDefined()
      expect(testUser.fullname).toBe(userData.fullname)
      expect(testUser.email).toBe(userData.email)
    })

    test('should find user by id', async () => {
      const foundUser = await service.users.findById(testUser._id)

      expect(foundUser).toBeTruthy()
      expect(foundUser!._id).toBe(testUser._id)
      expect(foundUser!.email).toBe(testUser.email)
    })

    test('should find user by email', async () => {
      const foundUser = await service.users.findByEmail(testUser.email)

      expect(foundUser).toBeTruthy()
      expect(foundUser!._id).toBe(testUser._id)
      expect(foundUser!.fullname).toBe(testUser.fullname)
    })

    test('should update user', async () => {
      const updates = { fullname: 'Updated Test User' }
      const updatedUser = await service.users.update(testUser._id, updates)

      expect(updatedUser).toBeTruthy()
      expect(updatedUser!.fullname).toBe(updates.fullname)
      expect(updatedUser!.email).toBe(testUser.email)
    })

    test('should find or create BRH user', async () => {
      const brhUser = await service.users.findOrCreateBRH()

      expect(brhUser).toBeTruthy()
      expect(brhUser.email).toBe('brh@kyan.com')
      expect(brhUser.fullname).toBe('Big Red Head')
    })

    test('should delete user', async () => {
      const deleted = await service.users.delete(testUser._id)
      expect(deleted).toBe(true)

      const foundUser = await service.users.findById(testUser._id)
      expect(foundUser).toBeNull()
    })
  })

  describe('Track Service', () => {
    let testTrack: JBTrack

    test('should add tracks', async () => {
      const uris = ['spotify:track:test1', 'spotify:track:test2']

      const result = await service.tracks.addTracks(uris)

      expect(result.uris).toEqual(uris)
      expect(result.user).toBeTruthy()

      // Now get the actual track data
      const tracks = await service.tracks.findByUris(uris)
      expect(tracks.length).toBeGreaterThan(0)

      testTrack = tracks[0]
    })

    test('should find track by URI', async () => {
      if (!testTrack) {
        throw new Error('testTrack not defined')
      }

      const foundTrack = await service.tracks.findByUri(testTrack.uri)

      expect(foundTrack).toBeTruthy()
      expect(foundTrack!.uri).toBe(testTrack.uri)
    })

    test('should find tracks by URIs', async () => {
      const uris = ['spotify:track:test1', 'spotify:track:test2']
      const foundTracks = await service.tracks.findByUris(uris)

      expect(foundTracks.length).toBeGreaterThan(0)
    })

    test('should get track metrics', async () => {
      if (!testTrack) {
        throw new Error('testTrack not defined')
      }

      const metrics = await service.tracks.getTrackMetrics(testTrack.uri)

      expect(metrics).toBeTruthy()
      expect(typeof metrics.plays).toBe('number')
      expect(typeof metrics.votes).toBe('number')
    })

    test('should update playcount', async () => {
      if (!testTrack) {
        throw new Error('testTrack not defined')
      }

      const updatedTrack = await service.tracks.updatePlaycount(testTrack.uri)

      expect(updatedTrack).toBeTruthy()
      expect(updatedTrack!.metrics!.plays).toBeGreaterThan(0)
    })

    test('should find random tracks with high votes', async () => {
      const randomTracks = await service.tracks.findRandomTracksWithHighVotes(5)

      expect(Array.isArray(randomTracks)).toBe(true)
      // Note: May be empty if no tracks have high votes
    })
  })

  describe('Settings Service', () => {
    test('should clear state', async () => {
      await service.settings.clearState()

      const trackSeeds = await service.settings.getSeedTracks()
      const currentTrack = await service.settings.getCurrentTrack()
      const tracklist = await service.settings.getTracklist()

      expect(Array.isArray(trackSeeds)).toBe(true)
      expect(currentTrack).toBeNull()
      expect(Array.isArray(tracklist)).toBe(true)
    })

    test('should update current track', async () => {
      const testUri = 'spotify:track:current'
      const updatedUri = await service.settings.updateCurrentTrack(testUri)

      expect(updatedUri).toBe(testUri)

      const currentTrack = await service.settings.getCurrentTrack()
      expect(currentTrack).toBe(testUri)
    })

    test('should update tracklist', async () => {
      const testUris = ['spotify:track:1', 'spotify:track:2', 'spotify:track:3']
      const updatedUris = await service.settings.updateTracklist(testUris)

      expect(updatedUris).toEqual(testUris)

      const tracklist = await service.settings.getTracklist()
      expect(tracklist).toEqual(testUris)
    })

    test('should update JSON setting', async () => {
      const testKey = 'testSetting'
      const testValue = { foo: 'bar', number: 42 }

      await service.settings.updateJsonSetting(testKey, testValue)

      // If we got here without error, the operation succeeded
      expect(true).toBe(true)
    })
  })

  describe('Event Service', () => {
    let testUserId: string

    beforeAll(async () => {
      // Create a test user for events
      const user = await service.users.create({
        fullname: 'Event Test User',
        email: 'events@test.com'
      })
      testUserId = user._id
    })

    test('should create event', async () => {
      const eventData = {
        user: testUserId,
        key: 'test_event',
        payload: { action: 'test', timestamp: 1640995200000 }
      }

      await service.events.create(eventData)

      const userEvents = await service.events.findByUser(testUserId)
      expect(userEvents.length).toBeGreaterThan(0)
    })

    test('should find events by key', async () => {
      const events = await service.events.findByKey('test_event')

      expect(Array.isArray(events)).toBe(true)
    })

    test('should find recent events', async () => {
      const recentEvents = await service.events.findRecent(10)

      expect(Array.isArray(recentEvents)).toBe(true)
    })
  })

  describe('Image Service', () => {
    test('should store image', async () => {
      const testUri = 'spotify:image:test'
      const testUrl = 'https://example.com/image.jpg'

      await service.images.store(testUri, testUrl)

      const storedImage = await service.images.findByUri(testUri)
      expect(storedImage).toBeTruthy()
      expect(storedImage!.url).toBe(testUrl)
      expect(storedImage!._id).toBe(testUri)
    })

    test('should store many images', async () => {
      const imageData = {
        'spotify:image:1': 'https://example.com/1.jpg',
        'spotify:image:2': 'https://example.com/2.jpg',
        'spotify:image:3': 'https://example.com/3.jpg'
      }

      await service.images.storeMany(imageData)

      const uris = Object.keys(imageData)
      const storedImages = await service.images.findByUris(uris)

      expect(storedImages.length).toBeGreaterThan(0)
    })

    test('should delete expired images', async () => {
      const deletedCount = await service.images.deleteExpired()
      expect(typeof deletedCount).toBe('number')
    })
  })

  describe('Transaction Support', () => {
    test('should support transactions', async () => {
      const result = await service.transaction(async () => {
        const user = await service.users.create({
          fullname: 'Transaction Test',
          email: 'transaction@test.com'
        })
        return user._id
      })

      expect(result).toBeTruthy()

      const foundUser = await service.users.findById(result)
      expect(foundUser).toBeTruthy()
      expect(foundUser!.fullname).toBe('Transaction Test')
    })
  })
})

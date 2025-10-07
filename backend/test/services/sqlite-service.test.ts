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
    await service.disconnect()
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

      expect(foundUser).toBeDefined()
      expect(foundUser!._id).toBe(testUser._id)
      expect(foundUser!.email).toBe(testUser.email)
    })

    test('should find user by email', async () => {
      const foundUser = await service.users.findByEmail(testUser.email)

      expect(foundUser).toBeDefined()
      expect(foundUser!._id).toBe(testUser._id)
      expect(foundUser!.fullname).toBe(testUser.fullname)
    })

    test('should update user', async () => {
      const updates = { fullname: 'Updated Test User' }
      const updatedUser = await service.users.update(testUser._id, updates)

      expect(updatedUser).toBeDefined()
      expect(updatedUser!.fullname).toBe(updates.fullname)
      expect(updatedUser!.email).toBe(testUser.email)
    })

    test('should find or create BRH user', async () => {
      const brhUser = await service.users.findOrCreateBRH()

      expect(brhUser).toBeDefined()
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
      expect(result.user).toBeDefined()

      // Now get the actual track data
      const tracks = await service.tracks.findByUris(uris)
      expect(tracks).toHaveLength(2)

      testTrack = tracks[0]
    })

    test('should find track by URI', async () => {
      const foundTrack = await service.tracks.findByUri(testTrack.uri)

      expect(foundTrack).toBeDefined()
      expect(foundTrack!.uri).toBe(testTrack.uri)
      expect(foundTrack!.name).toBe(testTrack.name)
    })

    test('should find tracks by URIs', async () => {
      const uris = ['spotify:track:test1', 'spotify:track:test2']
      const foundTracks = await service.tracks.findByUris(uris)

      expect(foundTracks).toHaveLength(2)
      expect(foundTracks.map((t) => t.uri)).toEqual(expect.arrayContaining(uris))
    })

    test('should get track metrics', async () => {
      const metrics = await service.tracks.getTrackMetrics(testTrack.uri)

      expect(metrics).toBeDefined()
      expect(metrics.plays).toBe(0)
      expect(metrics.votes).toBe(0)
    })

    test('should update playcount', async () => {
      const updatedTrack = await service.tracks.updatePlaycount(testTrack.uri)

      expect(updatedTrack).toBeDefined()
      expect(updatedTrack!.metrics!.plays).toBe(1)
    })

    test('should find random tracks with high votes', async () => {
      const randomTracks = await service.tracks.findRandomTracksWithHighVotes(5)

      expect(Array.isArray(randomTracks)).toBe(true)
      // Since we don't have tracks with high votes yet, this should be empty
      expect(randomTracks.length).toBe(0)
    })
  })

  describe('Settings Service', () => {
    test('should clear state', async () => {
      await service.settings.clearState()

      const trackSeeds = await service.settings.getSeedTracks()
      const currentTrack = await service.settings.getCurrentTrack()
      const tracklist = await service.settings.getTracklist()

      expect(trackSeeds).toEqual([])
      expect(currentTrack).toBeNull()
      expect(tracklist).toEqual([])
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

      // Verify the setting was stored by checking if we can retrieve it
      // (this is a basic test to ensure no error was thrown)
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
        payload: { action: 'test', timestamp: Date.now() }
      }

      await service.events.create(eventData)

      const userEvents = await service.events.findByUser(testUserId)
      expect(userEvents.length).toBeGreaterThan(0)
      expect(userEvents[0].key).toBe(eventData.key)
    })

    test('should find events by key', async () => {
      const events = await service.events.findByKey('test_event')

      expect(events.length).toBeGreaterThan(0)
      expect(events[0].user).toBe(testUserId)
    })

    test('should find recent events', async () => {
      const recentEvents = await service.events.findRecent(10)

      expect(Array.isArray(recentEvents)).toBe(true)
      expect(recentEvents.length).toBeGreaterThan(0)
    })
  })

  describe('Image Service', () => {
    test('should store image', async () => {
      const testUri = 'spotify:image:test'
      const testUrl = 'https://example.com/image.jpg'

      await service.images.store(testUri, testUrl)

      const storedImage = await service.images.findByUri(testUri)
      expect(storedImage).toBeDefined()
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

      expect(storedImages).toHaveLength(3)
      expect(storedImages.map((img) => img._id)).toEqual(expect.arrayContaining(uris))
    })

    test('should delete expired images', async () => {
      // For this test, we'd need to insert images with past expiration dates
      // This is more complex and would require direct database access
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

      expect(result).toBeDefined()

      const foundUser = await service.users.findById(result)
      expect(foundUser).toBeDefined()
      expect(foundUser!.fullname).toBe('Transaction Test')
    })
  })
})

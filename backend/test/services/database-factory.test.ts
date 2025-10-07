import { DatabaseFactory } from '../../src/services/database/factory'
import { SQLiteConfig, MongoDBConfig } from '../../src/services/database/interfaces'
import { initializeSQLiteDatabase } from '../../src/services/database/sqlite/schema-runner'
import path from 'path'
import fs from 'fs'

describe('DatabaseFactory', () => {
  let testDbPath: string

  beforeAll(async () => {
    // Create a temporary test database for factory testing
    testDbPath = path.join(__dirname, '../../../databases/test-factory.db')

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
  })

  afterAll(async () => {
    // Cleanup
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }
  })

  describe('SQLite Database Creation', () => {
    test('should create SQLite service from factory', () => {
      const config: SQLiteConfig = {
        type: 'sqlite',
        connectionString: testDbPath,
        options: {
          enableWAL: true,
          timeout: 5000
        }
      }

      const service = DatabaseFactory.create(config)

      expect(service).toBeDefined()
      expect(service.users).toBeDefined()
      expect(service.tracks).toBeDefined()
      expect(service.settings).toBeDefined()
      expect(service.events).toBeDefined()
      expect(service.images).toBeDefined()
    })

    test('should connect and perform basic operations', async () => {
      const config: SQLiteConfig = {
        type: 'sqlite',
        connectionString: testDbPath,
        options: {
          enableWAL: true,
          timeout: 5000
        }
      }

      const service = DatabaseFactory.create(config)
      await service.connect()

      expect(service.isConnected()).toBe(true)

      // Test basic user operations
      const user = await service.users.create({
        fullname: 'Factory Test User',
        email: 'factory@test.com'
      })

      expect(user).toBeDefined()
      expect(user.fullname).toBe('Factory Test User')

      const foundUser = await service.users.findById(user._id)
      expect(foundUser).toBeDefined()
      expect(foundUser!.email).toBe('factory@test.com')

      // Test health check
      const isHealthy = await service.healthCheck()
      expect(isHealthy).toBe(true)

      await service.disconnect()
      expect(service.isConnected()).toBe(false)
    })
  })

  describe('Configuration Creation from Environment', () => {
    test('should create SQLite config from environment variables', () => {
      // Set environment variables
      const originalDbType = process.env.DB_TYPE
      const originalSqlitePath = process.env.SQLITE_PATH
      const originalSqliteWal = process.env.SQLITE_WAL
      const originalSqliteTimeout = process.env.SQLITE_TIMEOUT

      process.env.DB_TYPE = 'sqlite'
      process.env.SQLITE_PATH = './test.db'
      process.env.SQLITE_WAL = 'true'
      process.env.SQLITE_TIMEOUT = '10000'

      const config = DatabaseFactory.createConfigFromEnv()

      expect(config.type).toBe('sqlite')
      expect(config.connectionString).toBe('./test.db')
      expect((config as SQLiteConfig).options?.enableWAL).toBe(true)
      expect((config as SQLiteConfig).options?.timeout).toBe(10000)

      // Restore original environment variables
      if (originalDbType !== undefined) {
        process.env.DB_TYPE = originalDbType
      } else {
        delete process.env.DB_TYPE
      }
      if (originalSqlitePath !== undefined) {
        process.env.SQLITE_PATH = originalSqlitePath
      } else {
        delete process.env.SQLITE_PATH
      }
      if (originalSqliteWal !== undefined) {
        process.env.SQLITE_WAL = originalSqliteWal
      } else {
        delete process.env.SQLITE_WAL
      }
      if (originalSqliteTimeout !== undefined) {
        process.env.SQLITE_TIMEOUT = originalSqliteTimeout
      } else {
        delete process.env.SQLITE_TIMEOUT
      }
    })

    test('should create MongoDB config from environment variables', () => {
      // Set environment variables
      const originalDbType = process.env.DB_TYPE
      const originalMongoUrl = process.env.MONGODB_URL
      const originalPoolSize = process.env.MONGODB_MAX_POOL_SIZE

      process.env.DB_TYPE = 'mongodb'
      process.env.MONGODB_URL = 'mongodb://localhost:27017/test'
      process.env.MONGODB_MAX_POOL_SIZE = '15'

      const config = DatabaseFactory.createConfigFromEnv()

      expect(config.type).toBe('mongodb')
      expect(config.connectionString).toBe('mongodb://localhost:27017/test')
      expect((config as MongoDBConfig).options?.maxPoolSize).toBe(15)

      // Restore original environment variables
      if (originalDbType !== undefined) {
        process.env.DB_TYPE = originalDbType
      } else {
        delete process.env.DB_TYPE
      }
      if (originalMongoUrl !== undefined) {
        process.env.MONGODB_URL = originalMongoUrl
      } else {
        delete process.env.MONGODB_URL
      }
      if (originalPoolSize !== undefined) {
        process.env.MONGODB_MAX_POOL_SIZE = originalPoolSize
      } else {
        delete process.env.MONGODB_MAX_POOL_SIZE
      }
    })

    test('should default to MongoDB when DB_TYPE is unknown', () => {
      const originalDbType = process.env.DB_TYPE

      process.env.DB_TYPE = 'unknown'

      const config = DatabaseFactory.createConfigFromEnv()

      expect(config.type).toBe('mongodb')
      expect(config.connectionString).toBe('mongodb://localhost:27017/jukebox')

      // Restore original environment variable
      if (originalDbType !== undefined) {
        process.env.DB_TYPE = originalDbType
      } else {
        delete process.env.DB_TYPE
      }
    })
  })

  describe('Singleton Pattern', () => {
    test('should maintain singleton instance', () => {
      const config: SQLiteConfig = {
        type: 'sqlite',
        connectionString: testDbPath,
        options: {
          enableWAL: true
        }
      }

      DatabaseFactory.reset() // Ensure clean state

      const instance1 = DatabaseFactory.getInstance(config)
      const instance2 = DatabaseFactory.getInstance()

      expect(instance1).toBe(instance2)
    })

    test('should reset singleton instance', () => {
      const config: SQLiteConfig = {
        type: 'sqlite',
        connectionString: testDbPath,
        options: {
          enableWAL: true
        }
      }

      const instance1 = DatabaseFactory.getInstance(config)
      DatabaseFactory.reset()
      const instance2 = DatabaseFactory.getInstance(config)

      expect(instance1).not.toBe(instance2)
    })

    test('should throw error when getting instance without initial config', () => {
      DatabaseFactory.reset()

      expect(() => {
        DatabaseFactory.getInstance()
      }).toThrow('Database configuration required for first initialization')
    })
  })

  describe('Error Handling', () => {
    test('should throw error for unsupported database type', () => {
      const invalidConfig = {
        type: 'unsupported',
        connectionString: 'test'
      } as any

      expect(() => {
        DatabaseFactory.create(invalidConfig)
      }).toThrow('Unsupported database type: unsupported')
    })
  })
})

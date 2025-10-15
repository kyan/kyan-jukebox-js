import { beforeAll, afterAll, beforeEach, afterEach, mock } from 'bun:test'
import { initializeDatabase, shutdownDatabase } from '../src/services/database/factory'
import { SQLiteConfig } from '../src/services/database/interfaces'

// Initialize test database before all tests
beforeAll(async () => {
  const testConfig: SQLiteConfig = {
    type: 'sqlite',
    connectionString: './databases/test.db',
    options: {
      enableWAL: true,
      timeout: 5000
    }
  }

  await initializeDatabase(testConfig)
})

// Shutdown database after all tests
afterAll(async () => {
  await shutdownDatabase()
})

// Clear all mock call history before each test
beforeEach(() => {
  mock.clearAllMocks()
})

// Restore all mocks to their original implementations after each test
afterEach(() => {
  mock.restore()
})

export {}

import {
  IDatabaseService,
  DatabaseConfig,
  MongoDBConfig,
  SQLiteConfig
} from './interfaces'
import { MongoDBService } from './mongodb-service'
import logger from '../../config/logger'

export class DatabaseFactory {
  private static instance: IDatabaseService | null = null

  /**
   * Create a database service instance based on configuration
   */
  static create(config: DatabaseConfig): IDatabaseService {
    switch (config.type) {
      case 'mongodb':
        return new MongoDBService(config as MongoDBConfig)

      case 'sqlite':
        throw new Error('SQLite implementation not yet available. Coming soon!')

      default:
        throw new Error(`Unsupported database type: ${(config as any).type}`)
    }
  }

  /**
   * Get or create a singleton database service instance
   */
  static getInstance(config?: DatabaseConfig): IDatabaseService {
    if (!this.instance) {
      if (!config) {
        throw new Error('Database configuration required for first initialization')
      }
      this.instance = this.create(config)
    }
    return this.instance
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static reset(): void {
    this.instance = null
  }

  /**
   * Create configuration from environment variables
   */
  static createConfigFromEnv(): DatabaseConfig {
    const dbType = process.env.DB_TYPE || 'mongodb'

    switch (dbType) {
      case 'mongodb':
        return {
          type: 'mongodb',
          connectionString:
            process.env.MONGODB_URL || 'mongodb://localhost:27017/jukebox',
          options: {
            maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10)
          }
        } as MongoDBConfig

      case 'sqlite':
        return {
          type: 'sqlite',
          connectionString: process.env.SQLITE_PATH || './data/jukebox.db',
          options: {
            enableWAL: process.env.SQLITE_WAL === 'true',
            timeout: parseInt(process.env.SQLITE_TIMEOUT || '30000', 10)
          }
        } as SQLiteConfig

      default:
        logger.warn(`Unknown DB_TYPE: ${dbType}, falling back to MongoDB`)
        return {
          type: 'mongodb',
          connectionString:
            process.env.MONGODB_URL || 'mongodb://localhost:27017/jukebox',
          options: {
            maxPoolSize: 10
          }
        } as MongoDBConfig
    }
  }
}

/**
 * Global database service instance
 * Initialize once and use throughout the application
 */
let dbService: IDatabaseService | null = null

/**
 * Initialize the global database service
 */
export async function initializeDatabase(
  config?: DatabaseConfig
): Promise<IDatabaseService> {
  if (dbService) {
    logger.warn('Database service already initialized')
    return dbService
  }

  const finalConfig = config || DatabaseFactory.createConfigFromEnv()
  dbService = DatabaseFactory.create(finalConfig)

  try {
    await dbService.connect()
    logger.info('Database service initialized successfully', { type: finalConfig.type })
    return dbService
  } catch (error) {
    logger.error('Failed to initialize database service', { error: error.message })
    throw error
  }
}

/**
 * Get the global database service instance
 */
export function getDatabase(): IDatabaseService {
  if (!dbService) {
    throw new Error('Database service not initialized. Call initializeDatabase() first.')
  }
  return dbService
}

/**
 * Shutdown the database service gracefully
 */
export async function shutdownDatabase(): Promise<void> {
  if (dbService) {
    await dbService.disconnect()
    dbService = null
    logger.info('Database service shutdown complete')
  }
}

export default {
  DatabaseFactory,
  initializeDatabase,
  getDatabase,
  shutdownDatabase
}

import { initializeDatabase } from './database/factory'
import { IDatabaseService } from './database/interfaces'
import logger from '../config/logger'

/**
 * Legacy MongoDB service wrapper for backward compatibility
 * This replaces the original mongodb.ts file and uses the new database abstraction layer
 */
const MongodbService = async (): Promise<IDatabaseService> => {
  try {
    // Initialize the database service using environment configuration
    const dbService = await initializeDatabase()
    return dbService
  } catch (error) {
    logger.error(`MongoDB Service Error: ${error.message}`)
    throw new Error('MongoDB failed to connect!')
  }
}

export default MongodbService

import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import logger from '../../../config/logger'

export interface SchemaRunnerOptions {
  databasePath: string
  schemasPath?: string
  verbose?: boolean
}

export interface MigrationResult {
  success: boolean
  version?: number
  error?: string
  executedStatements?: number
}

/**
 * SQLite Schema Runner
 * Handles database schema initialization and migration management
 */
export class SQLiteSchemaRunner {
  private db: Database.Database
  private schemasPath: string
  private verbose: boolean

  constructor(options: SchemaRunnerOptions) {
    this.db = new Database(options.databasePath)
    this.schemasPath = options.schemasPath || path.join(__dirname, 'schemas')
    this.verbose = options.verbose || false

    // Enable foreign keys and set optimal pragmas (outside of any transaction)
    this.configurePragmas()
  }

  /**
   * Configure SQLite pragmas for optimal performance
   */
  private configurePragmas(): void {
    this.db.pragma('foreign_keys = ON')
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('synchronous = NORMAL')
    this.db.pragma('cache_size = 10000')
    this.db.pragma('temp_store = memory')
  }

  /**
   * Initialize the database with the complete schema
   */
  async initializeDatabase(): Promise<MigrationResult> {
    try {
      logger.info('Initializing SQLite database schema...')

      const schemaFile = path.join(this.schemasPath, 'create-database.sql')
      const schemaSQL = fs.readFileSync(schemaFile, 'utf-8')

      if (this.verbose) {
        logger.debug('Executing complete schema script', {
          fileSize: schemaSQL.length,
          filePath: schemaFile
        })
      }

      // Execute the entire schema file at once
      // better-sqlite3's exec method handles multiple statements correctly
      this.db.exec(schemaSQL)

      // Verify the schema was created successfully
      const tables = this.getTableList()
      const expectedTables = [
        'users',
        'tracks',
        'settings',
        'events',
        'images',
        'schema_version'
      ]

      for (const table of expectedTables) {
        if (!tables.includes(table)) {
          throw new Error(`Required table '${table}' was not created`)
        }
      }

      logger.info('Database schema initialized successfully', {
        tablesCreated: tables.length
      })

      return {
        success: true,
        version: 1,
        executedStatements: 1
      }
    } catch (error) {
      logger.error('Failed to initialize database schema', { error: error.message })
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Run individual schema files in order
   */
  async runSchemaFiles(fileNames: string[]): Promise<MigrationResult> {
    try {
      for (const fileName of fileNames) {
        const filePath = path.join(this.schemasPath, fileName)

        if (!fs.existsSync(filePath)) {
          throw new Error(`Schema file not found: ${fileName}`)
        }

        const sql = fs.readFileSync(filePath, 'utf-8')

        logger.info(`Running schema file: ${fileName}`)

        if (this.verbose) {
          logger.debug('Executing schema file', {
            file: fileName,
            fileSize: sql.length
          })
        }

        // Execute the entire file at once
        this.db.exec(sql)
      }

      logger.info('Schema files executed successfully', {
        filesProcessed: fileNames.length
      })

      return {
        success: true,
        executedStatements: fileNames.length
      }
    } catch (error) {
      logger.error('Failed to run schema files', { error: error.message })
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Check if the database has been initialized
   */
  isDatabaseInitialized(): boolean {
    try {
      const tables = this.getTableList()
      const requiredTables = ['users', 'tracks', 'settings', 'events', 'images']

      return requiredTables.every((table) => tables.includes(table))
    } catch (error) {
      return false
    }
  }

  /**
   * Get the current schema version
   */
  getCurrentVersion(): number | null {
    try {
      if (!this.tableExists('schema_version')) {
        return null
      }

      const result = this.db
        .prepare('SELECT MAX(version) as version FROM schema_version')
        .get() as { version: number }
      return result?.version || null
    } catch (error) {
      logger.error('Failed to get current schema version', { error: error.message })
      return null
    }
  }

  /**
   * Get migration status
   */
  getMigrationStatus(): any[] {
    try {
      if (!this.tableExists('migration_versions')) {
        return []
      }

      return this.db
        .prepare(
          `
        SELECT version, name, description, applied_at,
               CASE
                 WHEN applied_at IS NOT NULL THEN 'APPLIED'
                 ELSE 'PENDING'
               END as status
        FROM migration_versions
        ORDER BY version
      `
        )
        .all()
    } catch (error) {
      logger.error('Failed to get migration status', { error: error.message })
      return []
    }
  }

  /**
   * Validate database integrity
   */
  validateDatabase(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    try {
      // Check table existence
      const tables = this.getTableList()
      const expectedTables = ['users', 'tracks', 'settings', 'events', 'images']

      for (const table of expectedTables) {
        if (!tables.includes(table)) {
          errors.push(`Missing required table: ${table}`)
        }
      }

      // Check foreign key integrity
      const integrityCheck = this.db.prepare('PRAGMA foreign_key_check').all()
      if (integrityCheck.length > 0) {
        errors.push(`Foreign key integrity violations: ${integrityCheck.length}`)
      }

      // Check database integrity
      const integrityResult = this.db.prepare('PRAGMA integrity_check').get() as {
        integrity_check: string
      }
      if (integrityResult.integrity_check !== 'ok') {
        errors.push(`Database integrity check failed: ${integrityResult.integrity_check}`)
      }

      return {
        valid: errors.length === 0,
        errors
      }
    } catch (error) {
      errors.push(`Validation error: ${error.message}`)
      return {
        valid: false,
        errors
      }
    }
  }

  /**
   * Get database statistics
   */
  getDatabaseStats(): any {
    try {
      const tables = this.getTableList()
      const stats: any = {
        tableCount: tables.length,
        tables: {}
      }

      for (const table of tables) {
        try {
          const count = this.db
            .prepare(`SELECT COUNT(*) as count FROM ${table}`)
            .get() as { count: number }
          stats.tables[table] = {
            rowCount: count.count
          }
        } catch (error) {
          stats.tables[table] = {
            rowCount: 'error',
            error: error.message
          }
        }
      }

      // Get database size
      const sizeResult = this.db.prepare('PRAGMA page_count').get() as {
        page_count: number
      }
      const pageSizeResult = this.db.prepare('PRAGMA page_size').get() as {
        page_size: number
      }
      stats.databaseSize = sizeResult.page_count * pageSizeResult.page_size

      return stats
    } catch (error) {
      logger.error('Failed to get database stats', { error: error.message })
      return { error: error.message }
    }
  }

  /**
   * Close the database connection
   */
  close(): void {
    try {
      this.db.close()
      logger.info('Database connection closed')
    } catch (error) {
      logger.error('Error closing database connection', { error: error.message })
    }
  }

  /**
   * Private helper methods
   */

  private getTableList(): string[] {
    const result = this.db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `
      )
      .all() as { name: string }[]

    return result.map((row) => row.name)
  }

  private tableExists(tableName: string): boolean {
    const result = this.db
      .prepare(
        `
      SELECT name FROM sqlite_master
      WHERE type='table' AND name = ?
    `
      )
      .get(tableName)

    return !!result
  }

  // Removed splitSQLStatements method - using direct exec instead
}

/**
 * Convenience function to initialize a database
 */
export async function initializeSQLiteDatabase(
  databasePath: string,
  options?: Partial<SchemaRunnerOptions>
): Promise<MigrationResult> {
  const runner = new SQLiteSchemaRunner({
    databasePath,
    ...options
  })

  try {
    const result = await runner.initializeDatabase()
    runner.close()
    return result
  } catch (error) {
    runner.close()
    throw error
  }
}

/**
 * Convenience function to validate a database
 */
export function validateSQLiteDatabase(databasePath: string): {
  valid: boolean
  errors: string[]
} {
  const runner = new SQLiteSchemaRunner({ databasePath })

  try {
    const result = runner.validateDatabase()
    runner.close()
    return result
  } catch (error) {
    runner.close()
    return {
      valid: false,
      errors: [error.message]
    }
  }
}

export default SQLiteSchemaRunner

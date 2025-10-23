#!/usr/bin/env ts-node

/**
 * SQLite Database Initialization Script
 *
 * This script initializes a new SQLite database with the complete schema
 * for the Kyan Jukebox application. It can be used for:
 * - Setting up development databases
 * - Testing schema creation
 * - Initializing production databases
 *
 * Usage:
 *   ts-node scripts/sqlite/init-database.ts [database-path] [options]
 *
 * Examples:
 *   ts-node scripts/sqlite/init-database.ts
 *   ts-node scripts/sqlite/init-database.ts ./databases/test.db
 *   ts-node scripts/sqlite/init-database.ts ./databases/jukebox.db --verbose
 */

import { Command } from 'commander'
import path from 'path'
import fs from 'fs'
import { SQLiteSchemaRunner, initializeSQLiteDatabase } from '../../src/services/database/sqlite/schema-runner'

const program = new Command()

program
  .name('init-database')
  .description('Initialize SQLite database with complete schema')
  .argument('[database-path]', 'Path to SQLite database file', './databases/jukebox.db')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-f, --force', 'Force initialization (overwrite existing database)')
  .option('--validate', 'Validate database after creation')
  .option('--stats', 'Show database statistics after creation')
  .option('--dry-run', 'Show what would be done without executing')

program.action(async (databasePath: string, options: any) => {
  console.log('🎵 Kyan Jukebox - SQLite Database Initialization')
  console.log('=' .repeat(50))

  try {
    // Resolve absolute path
    const absolutePath = path.resolve(databasePath)
    const databaseDir = path.dirname(absolutePath)

    console.log(`Database path: ${absolutePath}`)
    console.log(`Database directory: ${databaseDir}`)

    // Check if database already exists
    if (fs.existsSync(absolutePath)) {
      if (!options.force) {
        console.log('❌ Database already exists. Use --force to overwrite.')
        process.exit(1)
      } else {
        console.log('⚠️  Removing existing database...')
        fs.unlinkSync(absolutePath)
      }
    }

    // Ensure database directory exists
    if (!fs.existsSync(databaseDir)) {
      console.log(`📁 Creating database directory: ${databaseDir}`)
      if (!options.dryRun) {
        fs.mkdirSync(databaseDir, { recursive: true })
      }
    }

    if (options.dryRun) {
      console.log('🔍 DRY RUN - Would initialize database with schema')
      console.log('   - Create tables: users, tracks, settings, events, images')
      console.log('   - Create indexes for performance optimization')
      console.log('   - Set up triggers for automatic timestamps')
      console.log('   - Insert initial data (BRH user, default settings)')
      return
    }

    console.log('🚀 Initializing database schema...')

    // Initialize the database
    const result = await initializeSQLiteDatabase(absolutePath, {
      verbose: options.verbose
    })

    if (!result.success) {
      console.log(`❌ Failed to initialize database: ${result.error}`)
      process.exit(1)
    }

    console.log('✅ Database initialized successfully!')
    console.log(`   - Schema version: ${result.version}`)
    console.log(`   - Statements executed: ${result.executedStatements}`)

    // Validation
    if (options.validate) {
      console.log('\n🔍 Validating database...')
      const runner = new SQLiteSchemaRunner({ databasePath: absolutePath })

      const validation = runner.validateDatabase()
      if (validation.valid) {
        console.log('✅ Database validation passed')
      } else {
        console.log('❌ Database validation failed:')
        validation.errors.forEach(error => console.log(`   - ${error}`))
      }

      runner.close()
    }

    // Statistics
    if (options.stats) {
      console.log('\n📊 Database Statistics:')
      const runner = new SQLiteSchemaRunner({ databasePath: absolutePath })

      const stats = runner.getDatabaseStats()
      if (stats.error) {
        console.log(`   Error: ${stats.error}`)
      } else {
        console.log(`   - Tables: ${stats.tableCount}`)
        console.log(`   - Database size: ${formatBytes(stats.databaseSize)}`)
        console.log('   - Table row counts:')
        Object.entries(stats.tables).forEach(([table, info]: [string, any]) => {
          console.log(`     ${table}: ${info.rowCount} rows`)
        })
      }

      runner.close()
    }

    console.log('\n🎉 Database initialization complete!')
    console.log(`   Database location: ${absolutePath}`)
    console.log('   You can now use this database with the SQLite service.')

  } catch (error) {
    console.error('❌ Fatal error during database initialization:')
    console.error(error.message)
    if (options.verbose) {
      console.error(error.stack)
    }
    process.exit(1)
  }
})

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Parse command line arguments
program.parse()

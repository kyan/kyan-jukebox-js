#!/usr/bin/env ts-node

/**
 * SQLite Database Test Script
 *
 * This script tests the newly created SQLite databases to ensure they work
 * correctly with the SQLite service implementation.
 *
 * Usage:
 *   ts-node scripts/sqlite/test-database.ts [database-path]
 *
 * Examples:
 *   ts-node scripts/sqlite/test-database.ts
 *   ts-node scripts/sqlite/test-database.ts ./databases/test.db
 */

import { Command } from 'commander'
import path from 'path'
import fs from 'fs'
import { SQLiteService } from '../../src/services/database/sqlite-service'
import { SQLiteConfig } from '../../src/services/database/interfaces'

const program = new Command()

program
  .name('test-database')
  .description('Test SQLite database functionality')
  .argument('[database-path]', 'Path to SQLite database file', './databases/jukebox.db')
  .option('-v, --verbose', 'Enable verbose logging')

program.action(async (databasePath: string, options: any) => {
  console.log('🎵 Kyan Jukebox - SQLite Database Test')
  console.log('=' .repeat(40))

  try {
    // Resolve absolute path
    const absolutePath = path.resolve(databasePath)

    if (!fs.existsSync(absolutePath)) {
      console.log(`❌ Database not found: ${absolutePath}`)
      console.log('   Run init-database.ts first to create the database')
      process.exit(1)
    }

    console.log(`Database: ${absolutePath}`)

    // Create service configuration
    const config: SQLiteConfig = {
      type: 'sqlite',
      connectionString: absolutePath,
      options: {
        enableWAL: true,
        timeout: 5000
      }
    }

    // Create and connect service
    console.log('\n🔌 Connecting to database...')
    const service = new SQLiteService(config)
    await service.connect()

    if (!service.isConnected()) {
      console.log('❌ Failed to connect to database')
      process.exit(1)
    }

    console.log('✅ Connected successfully')

    // Test health check
    console.log('\n🏥 Testing health check...')
    const isHealthy = await service.healthCheck()
    console.log(isHealthy ? '✅ Health check passed' : '❌ Health check failed')

    // Test user operations
    console.log('\n👤 Testing user operations...')

    // Check existing BRH user
    const brhUser = await service.users.findOrCreateBRH()
    console.log(`✅ BRH User: ${brhUser.fullname} (${brhUser.email})`)

    // Create a test user
    const testUser = await service.users.create({
      fullname: 'Test User',
      email: 'test@example.com'
    })
    console.log(`✅ Created user: ${testUser.fullname} (ID: ${testUser._id})`)

    // Find the user
    const foundUser = await service.users.findById(testUser._id)
    console.log(`✅ Found user: ${foundUser?.fullname}`)

    // Test track operations
    console.log('\n🎵 Testing track operations...')

    const trackUris = ['spotify:track:test1', 'spotify:track:test2']
    const addResult = await service.tracks.addTracks(trackUris, testUser)
    console.log(`✅ Added ${addResult.uris.length} tracks`)

    const tracks = await service.tracks.findByUris(trackUris)
    console.log(`✅ Found ${tracks.length} tracks`)

    if (tracks.length > 0) {
      const track = tracks[0]
      console.log(`   - Track: ${track.name} (${track.uri})`)

      // Test playcount update
      const updatedTrack = await service.tracks.updatePlaycount(track.uri)
      if (updatedTrack) {
        console.log(`✅ Updated playcount: ${updatedTrack.metrics?.plays} plays`)
      }
    }

    // Test settings operations
    console.log('\n⚙️  Testing settings operations...')

    await service.settings.clearState()
    console.log('✅ Cleared state')

    await service.settings.updateCurrentTrack('spotify:track:current')
    const currentTrack = await service.settings.getCurrentTrack()
    console.log(`✅ Current track: ${currentTrack}`)

    await service.settings.updateTracklist(['spotify:track:1', 'spotify:track:2'])
    const tracklist = await service.settings.getTracklist()
    console.log(`✅ Tracklist: ${tracklist.length} tracks`)

    // Test event operations
    console.log('\n📝 Testing event operations...')

    await service.events.create({
      user: testUser._id,
      key: 'test_event',
      payload: { action: 'test', timestamp: Date.now() }
    })
    console.log('✅ Created event')

    const events = await service.events.findByUser(testUser._id)
    console.log(`✅ Found ${events.length} events for user`)

    // Test image operations
    console.log('\n🖼️  Testing image operations...')

    await service.images.store('spotify:image:test', 'https://example.com/image.jpg')
    console.log('✅ Stored image')

    const image = await service.images.findByUri('spotify:image:test')
    console.log(`✅ Found image: ${image?.url}`)

    // Test transaction support
    console.log('\n🔄 Testing transaction support...')

    const transactionResult = await service.transaction(async () => {
      const newUser = await service.users.create({
        fullname: 'Transaction Test',
        email: 'transaction@test.com'
      })
      return newUser._id
    })
    console.log(`✅ Transaction completed: ${transactionResult}`)

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...')
    await service.users.delete(testUser._id)
    await service.users.delete(transactionResult)
    console.log('✅ Test data cleaned up')

    // Disconnect
    console.log('\n🔌 Disconnecting...')
    await service.disconnect()
    console.log('✅ Disconnected')

    console.log('\n🎉 All tests passed! Database is working correctly.')

  } catch (error) {
    console.error('\n❌ Test failed:')
    console.error(error.message)
    if (options.verbose) {
      console.error(error.stack)
    }
    process.exit(1)
  }
})

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

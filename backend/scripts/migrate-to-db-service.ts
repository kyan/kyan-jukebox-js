#!/usr/bin/env ts-node

import { program } from 'commander'
import { join } from 'path'
import { writeFileSync } from 'fs'
import { MigrationHelper } from '../src/services/database/migration-helper'

const DEFAULT_SRC_PATH = join(__dirname, '../src')

program
  .name('migrate-to-db-service')
  .description('Migrate codebase from direct model usage to database service abstraction')
  .version('1.0.0')

program
  .command('scan')
  .description('Scan for files that need migration')
  .option('-p, --path <path>', 'Source path to scan', DEFAULT_SRC_PATH)
  .action((options) => {
    console.log('🔍 Scanning for files that need migration...\n')

    const filesToMigrate = MigrationHelper.scanDirectory(options.path)

    if (filesToMigrate.length === 0) {
      console.log('✅ No files found that need migration!')
      return
    }

    console.log(`Found ${filesToMigrate.length} files that need migration:\n`)
    filesToMigrate.forEach((file, index) => {
      console.log(`${index + 1}. ${file.replace(options.path, '')}`)
    })

    console.log('\n📝 Run "migrate-to-db-service report" to generate a detailed migration report')
    console.log('🧪 Run "migrate-to-db-service dry-run" to preview changes')
    console.log('🚀 Run "migrate-to-db-service migrate" to perform the migration')
  })

program
  .command('report')
  .description('Generate a detailed migration report')
  .option('-p, --path <path>', 'Source path to scan', DEFAULT_SRC_PATH)
  .option('-o, --output <file>', 'Output file for the report', 'migration-report.md')
  .action((options) => {
    console.log('📋 Generating migration report...\n')

    const report = MigrationHelper.generateReport(options.path)
    writeFileSync(options.output, report, 'utf8')

    console.log(`✅ Migration report saved to: ${options.output}`)
    console.log('\n📖 Review the report before proceeding with migration')
  })

program
  .command('dry-run')
  .description('Preview migration changes without modifying files')
  .option('-p, --path <path>', 'Source path to migrate', DEFAULT_SRC_PATH)
  .action((options) => {
    console.log('🧪 Running migration in dry-run mode...\n')
    console.log('This will show you what changes would be made without actually modifying files.\n')

    const result = MigrationHelper.migrateDirectory(options.path, true)

    console.log('\n📊 Dry-run Results:')
    console.log(`Total files scanned: ${result.total}`)
    console.log(`Files that would be migrated: ${result.migrated}`)

    if (result.migrated > 0) {
      console.log('\n📁 Files that would be changed:')
      result.files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.replace(options.path, '')}`)
      })

      console.log('\n✅ Dry-run completed successfully!')
      console.log('🚀 Run "migrate-to-db-service migrate" to apply these changes')
    } else {
      console.log('\n✅ No files need migration!')
    }
  })

program
  .command('migrate')
  .description('Perform the actual migration')
  .option('-p, --path <path>', 'Source path to migrate', DEFAULT_SRC_PATH)
  .option('-f, --force', 'Force migration without confirmation', false)
  .action(async (options) => {
    console.log('🚀 Starting database service migration...\n')

    if (!options.force) {
      const { default: inquirer } = await import('inquirer')

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'This will modify your source files. Have you backed up your code?',
          default: false
        }
      ])

      if (!confirm) {
        console.log('❌ Migration cancelled. Please backup your code first.')
        process.exit(1)
      }
    }

    console.log('🔄 Migrating files...\n')

    const result = MigrationHelper.migrateDirectory(options.path, false)

    console.log('\n📊 Migration Results:')
    console.log(`Total files processed: ${result.total}`)
    console.log(`Files successfully migrated: ${result.migrated}`)

    if (result.migrated > 0) {
      console.log('\n📁 Migrated files:')
      result.files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.replace(options.path, '')}`)
      })

      console.log('\n✅ Migration completed successfully!')
      console.log('\n📋 Next Steps:')
      console.log('1. Test your application to ensure everything works correctly')
      console.log('2. Run your test suite')
      console.log('3. Verify database operations are working as expected')
      console.log('4. Once confirmed, you can remove the old model files')

      console.log('\n💡 Note: Some manual adjustments might be needed for complex patterns')
      console.log('Check the migrated files for any TODO comments or compilation errors')
    } else {
      console.log('\n✅ No files needed migration!')
    }
  })

program
  .command('validate')
  .description('Validate that migration was successful')
  .option('-p, --path <path>', 'Source path to validate', DEFAULT_SRC_PATH)
  .action((options) => {
    console.log('🔍 Validating migration...\n')

    const filesToMigrate = MigrationHelper.scanDirectory(options.path)

    if (filesToMigrate.length === 0) {
      console.log('✅ Migration validation passed!')
      console.log('No files found that still use direct model imports.')

      console.log('\n📋 Post-Migration Checklist:')
      console.log('□ All tests pass')
      console.log('□ Application starts without errors')
      console.log('□ Database operations work correctly')
      console.log('□ No TypeScript compilation errors')
      console.log('□ Remove old model files (optional)')
    } else {
      console.log('⚠️  Migration validation found issues!')
      console.log(`${filesToMigrate.length} files still contain direct model usage:\n`)

      filesToMigrate.forEach((file, index) => {
        console.log(`${index + 1}. ${file.replace(options.path, '')}`)
      })

      console.log('\n🔧 These files may need manual migration or were missed.')
      console.log('Run the migration again or check these files manually.')
    }
  })

program
  .command('rollback')
  .description('Rollback migration (requires git)')
  .action(async (options) => {
    console.log('🔄 Rolling back migration...\n')

    try {
      const { execSync } = require('child_process')

      // Check if we're in a git repository
      execSync('git rev-parse --git-dir', { stdio: 'ignore' })

      const { default: inquirer } = await import('inquirer')

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'This will reset all changes to the last git commit. Continue?',
          default: false
        }
      ])

      if (!confirm) {
        console.log('❌ Rollback cancelled.')
        process.exit(1)
      }

      console.log('🔄 Resetting to last commit...')
      execSync('git reset --hard HEAD', { stdio: 'inherit' })

      console.log('✅ Rollback completed successfully!')
    } catch (error) {
      console.error('❌ Rollback failed:', error.message)
      console.log('\n💡 Manual rollback options:')
      console.log('1. Use git reset --hard HEAD (if you have git)')
      console.log('2. Restore from your backup')
      console.log('3. Manually revert the changes')
    }
  })

// Error handling
program.on('command:*', () => {
  console.error('❌ Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
  process.exit(1)
})

// Parse command line arguments
program.parse()

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log('🎯 Database Service Migration Tool\n')
  console.log('This tool helps migrate your codebase from direct Mongoose model usage')
  console.log('to the new database service abstraction layer.\n')

  console.log('Quick Start:')
  console.log('1. npm run migrate:scan       - Find files that need migration')
  console.log('2. npm run migrate:dry-run    - Preview changes')
  console.log('3. npm run migrate:migrate    - Perform migration')
  console.log('4. npm run migrate:validate   - Verify migration success\n')

  program.help()
}

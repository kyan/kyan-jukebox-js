import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import logger from '../../config/logger'

interface ImportReplacement {
  from: string
  to: string
  type: 'direct' | 'method' | 'service'
}

/**
 * Migration helper to update existing codebase to use the new database service abstraction
 */
export class MigrationHelper {
  private static readonly IMPORT_REPLACEMENTS: ImportReplacement[] = [
    // Direct model imports
    {
      from: "import User from '../models/user'",
      to: "import { getDatabase } from '../services/database/factory'",
      type: 'direct'
    },
    {
      from: "import Track from '../models/track'",
      to: "import { getDatabase } from '../services/database/factory'",
      type: 'direct'
    },
    {
      from: "import Setting from '../models/setting'",
      to: "import { getDatabase } from '../services/database/factory'",
      type: 'direct'
    },
    {
      from: "import Event from '../models/event'",
      to: "import { getDatabase } from '../services/database/factory'",
      type: 'direct'
    },
    {
      from: "import Image from '../models/image'",
      to: "import { getDatabase } from '../services/database/factory'",
      type: 'direct'
    },
    // Method imports
    {
      from: "import { updateTrackPlaycount, updateTrackVote } from '../models/track'",
      to: "import { getDatabase } from '../services/database/factory'",
      type: 'method'
    }
  ]

  private static readonly CODE_REPLACEMENTS = [
    // User operations
    { from: 'User.findOne({ email', to: 'db.users.findByEmail(' },
    { from: 'User.findById(', to: 'db.users.findById(' },
    { from: 'User.findOneAndUpdate(', to: 'db.users.update(' },
    { from: 'User.create(', to: 'db.users.create(' },
    { from: 'User.findOrUseBRH(', to: 'db.users.findOrCreateBRH(' },

    // Track operations
    { from: 'Track.findTracks(', to: 'db.tracks.findByUris(' },
    { from: 'Track.addTracks(', to: 'db.tracks.addTracks(' },
    { from: 'Track.findById(', to: 'db.tracks.findByUri(' },
    { from: 'Track.findOrUseBRH(', to: 'db.users.findOrCreateBRH(' },
    { from: 'updateTrackPlaycount(', to: 'db.tracks.updatePlaycount(' },
    { from: 'updateTrackVote(', to: 'db.tracks.updateVote(' },

    // Setting operations
    { from: 'Setting.clearState()', to: 'db.settings.clearState()' },
    { from: 'Setting.initializeState(', to: 'db.settings.initializeState(' },
    { from: 'Setting.addToTrackSeedList(', to: 'db.settings.addToTrackSeedList(' },
    { from: 'Setting.trimTracklist(', to: 'db.settings.trimTracklist(' },
    { from: 'Setting.updateCurrentTrack(', to: 'db.settings.updateCurrentTrack(' },
    { from: 'Setting.updateTracklist(', to: 'db.settings.updateTracklist(' },
    { from: 'Setting.removeFromSeeds(', to: 'db.settings.removeFromSeeds(' },
    { from: 'Setting.getSeedTracks()', to: 'db.settings.getSeedTracks()' },
    { from: 'Setting.getTracklist()', to: 'db.settings.getTracklist()' },
    {
      from: 'Setting.getPlayedTracksFromTracklist()',
      to: 'db.settings.getPlayedTracksFromTracklist()'
    },
    { from: 'Setting.findOne(', to: 'db.settings.getCurrentTrack(' },

    // Event operations
    { from: 'Event.create(', to: 'db.events.create(' },
    { from: 'Event.find(', to: 'db.events.findByUser(' },
    { from: 'Event.deleteMany(', to: 'db.events.deleteOld(' },

    // Image operations
    { from: 'Image.find({ _id: { $in:', to: 'db.images.findByUris(' },
    { from: 'Image.findOneAndUpdate(', to: 'db.images.store(' },
    { from: 'Image.findById(', to: 'db.images.findByUri(' },
    { from: 'Image.deleteMany(', to: 'db.images.deleteExpired(' },
    { from: 'Image.bulkWrite(', to: 'db.images.storeMany(' }
  ]

  /**
   * Scan directory for TypeScript files that need migration
   */
  static scanDirectory(dirPath: string): string[] {
    const filesToMigrate: string[] = []

    const scanRecursive = (currentPath: string) => {
      const items = readdirSync(currentPath)

      for (const item of items) {
        const fullPath = join(currentPath, item)
        const stat = statSync(fullPath)

        if (
          stat.isDirectory() &&
          !item.includes('node_modules') &&
          !item.includes('.git')
        ) {
          scanRecursive(fullPath)
        } else if (stat.isFile() && extname(item) === '.ts') {
          const content = readFileSync(fullPath, 'utf8')

          // Check if file contains model imports that need migration
          const hasModelImports = this.IMPORT_REPLACEMENTS.some((replacement) =>
            content.includes(replacement.from)
          )

          // Check if file contains model method calls that need migration
          const hasModelCalls = this.CODE_REPLACEMENTS.some((replacement) =>
            content.includes(replacement.from)
          )

          if (hasModelImports || hasModelCalls) {
            filesToMigrate.push(fullPath)
          }
        }
      }
    }

    scanRecursive(dirPath)
    return filesToMigrate
  }

  /**
   * Migrate a single file to use the new database service abstraction
   */
  static migrateFile(filePath: string, dryRun: boolean = false): boolean {
    try {
      let content = readFileSync(filePath, 'utf8')
      let hasChanges = false

      // Track if we need to add the database import
      let needsDbImport = false

      // Replace import statements
      for (const replacement of this.IMPORT_REPLACEMENTS) {
        if (content.includes(replacement.from)) {
          content = content.replace(replacement.from, replacement.to)
          hasChanges = true
          needsDbImport = true
        }
      }

      // Replace method calls
      for (const replacement of this.CODE_REPLACEMENTS) {
        if (content.includes(replacement.from)) {
          hasChanges = true
          needsDbImport = true
        }
      }

      // Add const db = getDatabase() if needed
      if (needsDbImport && !content.includes('const db = getDatabase()')) {
        // Find a good place to insert the db declaration
        // Look for function bodies or class methods
        const functionRegex =
          /(const\s+\w+\s*=\s*[^=]*=>|function\s+\w+\s*\(|async\s+function|\w+\s*\([^)]*\)\s*{)/g
        const match = functionRegex.exec(content)

        if (match) {
          // Insert after the first function/method declaration
          const insertIndex = content.indexOf('{', match.index) + 1
          const beforeInsert = content.substring(0, insertIndex)
          const afterInsert = content.substring(insertIndex)
          content = beforeInsert + '\n  const db = getDatabase()' + afterInsert
        } else {
          // If no function found, add at the beginning of the file after imports
          const lastImportIndex = content.lastIndexOf('import ')
          if (lastImportIndex !== -1) {
            const lineEnd = content.indexOf('\n', lastImportIndex)
            const beforeInsert = content.substring(0, lineEnd + 1)
            const afterInsert = content.substring(lineEnd + 1)
            content = beforeInsert + '\nconst db = getDatabase()\n' + afterInsert
          }
        }
      }

      // Now replace the actual method calls
      for (const replacement of this.CODE_REPLACEMENTS) {
        content = content.replace(
          new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          replacement.to
        )
      }

      // Handle special cases for MongoDB-specific operations
      content = this.handleSpecialCases(content)

      if (hasChanges && !dryRun) {
        writeFileSync(filePath, content, 'utf8')
        logger.info(`Migrated file: ${filePath}`)
        return true
      } else if (hasChanges && dryRun) {
        logger.info(`Would migrate file: ${filePath}`)
        return true
      }

      return false
    } catch (error) {
      logger.error(`Failed to migrate file ${filePath}:`, error.message)
      return false
    }
  }

  /**
   * Handle special MongoDB-specific operations that need custom logic
   */
  private static handleSpecialCases(content: string): string {
    // Replace MongoDB query patterns with service equivalents
    content = content.replace(
      /\.findOne\(\s*{\s*email:\s*([^}]+)\s*}\s*\)/g,
      '.findByEmail($1)'
    )

    content = content.replace(
      /\.find\(\s*{\s*_id:\s*{\s*\$in:\s*([^}]+)\s*}\s*}\s*\)/g,
      '.findByUris($1)'
    )

    // Replace .exec() calls
    content = content.replace(/\.exec\(\)/g, '')

    // Replace .toObject() calls (not needed in abstraction)
    content = content.replace(/\.toObject\(\)/g, '')

    // Replace MongoDB operators
    content = content.replace(/\$push/g, 'push')
    content = content.replace(/\$pull/g, 'pull')
    content = content.replace(/\$set/g, 'set')

    return content
  }

  /**
   * Migrate all files in a directory
   */
  static migrateDirectory(
    dirPath: string,
    dryRun: boolean = false
  ): {
    total: number
    migrated: number
    files: string[]
  } {
    const filesToMigrate = this.scanDirectory(dirPath)
    let migratedCount = 0
    const migratedFiles: string[] = []

    logger.info(`Found ${filesToMigrate.length} files that need migration`)

    for (const filePath of filesToMigrate) {
      if (this.migrateFile(filePath, dryRun)) {
        migratedCount++
        migratedFiles.push(filePath)
      }
    }

    return {
      total: filesToMigrate.length,
      migrated: migratedCount,
      files: migratedFiles
    }
  }

  /**
   * Generate a migration report
   */
  static generateReport(dirPath: string): string {
    const filesToMigrate = this.scanDirectory(dirPath)
    let report = `# Database Migration Report\n\n`
    report += `Total files requiring migration: ${filesToMigrate.length}\n\n`

    report += `## Files to migrate:\n\n`
    for (const filePath of filesToMigrate) {
      report += `- ${filePath}\n`
    }

    report += `\n## Migration Steps:\n\n`
    report += `1. Run migration in dry-run mode to preview changes\n`
    report += `2. Run actual migration\n`
    report += `3. Test the application\n`
    report += `4. Remove old model files once confirmed working\n\n`

    report += `## Commands:\n\n`
    report += '```bash\n'
    report += '# Dry run\n'
    report += 'npm run migrate:dry-run\n\n'
    report += '# Actual migration\n'
    report += 'npm run migrate\n'
    report += '```\n'

    return report
  }
}

export default MigrationHelper

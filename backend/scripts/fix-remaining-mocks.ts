#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'

interface FixStats {
  filesProcessed: number
  filesFixed: number
  errors: string[]
}

const stats: FixStats = {
  filesProcessed: 0,
  filesFixed: 0,
  errors: []
}

const mockPatterns = {
  // Common mock module replacements
  emptyMocks: [
    {
      pattern: /mock\.module\(['"]([^'"]+)['"],\s*\(\)\s*=>\s*\(\{\}\)\)/g,
      replacement: (match: string, modulePath: string) => {
        if (modulePath.includes('config/logger')) {
          return `mock.module('${modulePath}', () => ({
  default: {
    info: mock(() => {}),
    error: mock(() => {}),
    warn: mock(() => {}),
    debug: mock(() => {})
  }
}))`
        }

        if (modulePath.includes('utils/event-logger')) {
          return `mock.module('${modulePath}', () => ({
  default: {
    info: mock(() => {})
  }
}))`
        }

        if (modulePath.includes('utils/broadcaster')) {
          return `mock.module('${modulePath}', () => ({
  default: {
    toClient: mock(() => {}),
    toAll: mock(() => {}),
    stateChange: mock(() => {})
  }
}))`
        }

        if (modulePath.includes('services/spotify')) {
          return `mock.module('${modulePath}', () => ({
  default: {
    search: mock(),
    getTracks: mock(),
    canRecommend: mock(),
    validateTrack: mock()
  }
}))`
        }

        if (modulePath.includes('services/database/factory')) {
          return `mock.module('${modulePath}', () => ({
  getDatabase: mock(() => mockDatabase)
}))`
        }

        if (modulePath.includes('decorators/')) {
          return `mock.module('${modulePath}', () => ({
  default: mock()
}))`
        }

        return match
      }
    }
  ],

  // Fix variable declarations that no longer work
  variableFixes: [
    {
      pattern: /const (\w+) = (\w+) as any\s*\n\s*\1\.mockReturnValue\(([^)]+)\)/g,
      replacement: '// $1 is mocked via mock.module above'
    }
  ],

  // Add proper mock clearing
  clearMocksFixes: [
    {
      pattern: /beforeEach\(\(\) => \{\s*\/\/ Clear individual mocks as needed\s*\}\)/g,
      replacement: (match: string, content: string) => {
        // This will be filled in based on the mocks found in the file
        return match
      }
    }
  ]
}

function fixMockingIssues(content: string, filePath: string): string {
  let fixed = content

  // Apply empty mock replacements
  for (const pattern of mockPatterns.emptyMocks) {
    fixed = fixed.replace(pattern.pattern, pattern.replacement as any)
  }

  // Apply variable fixes
  for (const pattern of mockPatterns.variableFixes) {
    fixed = fixed.replace(pattern.pattern, pattern.replacement as string)
  }

  // Find all mock variables and create proper clearing
  const mockVarMatches = fixed.match(/const (mock\w+) = mock\(\)/g) || []
  const moduleVarMatches = fixed.match(/mock\.module\([^,]+,\s*\(\)\s*=>\s*\(\{\s*default:\s*(\w+)/g) || []

  if (mockVarMatches.length > 0 || moduleVarMatches.length > 0) {
    const clearStatements = [
      ...mockVarMatches.map(match => {
        const varName = match.match(/const (\w+)/)?.[1]
        return varName ? `${varName}.mockClear()` : ''
      }),
      ...moduleVarMatches.map(match => {
        const varName = match.match(/default:\s*(\w+)/)?.[1]
        return varName ? `${varName}.info?.mockClear?.()` : ''
      })
    ].filter(Boolean)

    if (clearStatements.length > 0) {
      fixed = fixed.replace(
        /beforeEach\(\(\) => \{\s*\/\/ Clear individual mocks as needed\s*\}\)/g,
        `beforeEach(() => {
    ${clearStatements.join('\n    ')}
  })`
      )
    }
  }

  // Add proper database mock structure if needed
  if (fixed.includes('mockDatabase') && fixed.includes('services/database/factory')) {
    // Ensure mockDatabase has common properties
    const dbMockPattern = /const mockDatabase = \{[\s\S]*?\}/m
    const match = fixed.match(dbMockPattern)
    if (match && match[0]) {
      let dbMock = match[0]

      // Add missing common services if not present
      if (!dbMock.includes('events:')) {
        dbMock = dbMock.replace(/\}$/, `  events: {
    create: mock(),
    findByUser: mock(),
    findByKey: mock(),
    findRecent: mock()
  }
}`)
      }

      if (!dbMock.includes('users:')) {
        dbMock = dbMock.replace(/\}$/, `  users: {
    create: mock(),
    findById: mock(),
    findByEmail: mock(),
    update: mock(),
    delete: mock(),
    findOrCreateBRH: mock()
  }
}`)
      }

      if (!dbMock.includes('settings:')) {
        dbMock = dbMock.replace(/\}$/, `  settings: {
    updateCurrentTrack: mock(),
    getCurrentTrack: mock(),
    updateTracklist: mock(),
    getTracklist: mock(),
    getSeedTracks: mock(),
    clearState: mock(),
    trimTracklist: mock(),
    addToTrackSeedList: mock(),
    removeFromSeeds: mock(),
    updateJsonSetting: mock()
  }
}`)
      }

      fixed = fixed.replace(match[0], dbMock)
    }
  }

  // Fix specific assertion patterns
  fixed = fixed.replace(
    /expect\(([^.]+)\.info\)\.toHaveBeenCalledWith/g,
    'expect(mock$1.info).toHaveBeenCalledWith'
  )

  fixed = fixed.replace(
    /expect\(([^.]+)\.error\)\.toHaveBeenCalledWith/g,
    'expect(mock$1.error).toHaveBeenCalledWith'
  )

  return fixed
}

async function processFile(filePath: string): Promise<void> {
  stats.filesProcessed++

  try {
    const content = fs.readFileSync(filePath, 'utf8')

    // Skip if doesn't need fixing
    if (!content.includes('mock.module(') || !content.includes('() => ({})')) {
      return
    }

    console.log(`Fixing: ${filePath}`)

    const fixed = fixMockingIssues(content, filePath)

    // Only write if content changed
    if (fixed !== content) {
      // Create backup
      const backupPath = `${filePath}.backup-fix`
      fs.writeFileSync(backupPath, content)

      // Write fixed content
      fs.writeFileSync(filePath, fixed)

      stats.filesFixed++
      console.log(`✓ Fixed: ${filePath}`)
    }

  } catch (error) {
    const errorMsg = `Error processing ${filePath}: ${error}`
    stats.errors.push(errorMsg)
    console.error(errorMsg)
  }
}

function findTestFiles(dir: string): string[] {
  const files: string[] = []

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...findTestFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      files.push(fullPath)
    }
  }

  return files
}

async function main() {
  console.log('🔧 Fixing remaining mock issues...\n')

  const testDir = path.join(process.cwd(), 'test')
  const testFiles = findTestFiles(testDir)

  console.log(`Found ${testFiles.length} test files\n`)

  for (const fullPath of testFiles) {
    await processFile(fullPath)
  }

  console.log('\n📊 Fix Summary:')
  console.log(`Files processed: ${stats.filesProcessed}`)
  console.log(`Files fixed: ${stats.filesFixed}`)
  console.log(`Errors: ${stats.errors.length}`)

  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:')
    stats.errors.forEach((error) => console.log(`  ${error}`))
  }

  if (stats.filesFixed > 0) {
    console.log('\n✨ Fix complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Run tests: bun test')
    console.log('2. Review any remaining failures')
    console.log('3. Remove backup files when satisfied: rm **/*.backup-fix')
  } else {
    console.log('\nℹ️ No files needed fixing.')
  }
}

if (import.meta.main) {
  main().catch(console.error)
}

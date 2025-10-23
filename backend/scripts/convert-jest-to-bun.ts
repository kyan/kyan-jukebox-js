#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'

interface ConversionStats {
  filesProcessed: number
  filesConverted: number
  errors: string[]
}

const stats: ConversionStats = {
  filesProcessed: 0,
  filesConverted: 0,
  errors: []
}

function convertJestToBun(content: string, filePath: string): string {
  let converted = content

  // Replace Jest imports with bun:test imports
  if (
    converted.includes('jest.') ||
    converted.includes('it(') ||
    converted.includes('describe(')
  ) {
    // Add bun:test imports at the top
    const imports = [
      'expect',
      'test',
      'describe',
      'beforeEach',
      'afterEach',
      'beforeAll',
      'afterAll',
      'mock',
      'spyOn'
    ]

    const existingImports = converted.match(/^import.*from\s+['"]bun:test['"].*$/m)
    if (!existingImports) {
      const importLine = `import { ${imports.join(', ')} } from 'bun:test'\n`
      // Insert after any existing imports
      const lines = converted.split('\n')
      let insertIndex = 0
      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].startsWith('import ') ||
          (lines[i].startsWith('const ') && lines[i].includes(' = require('))
        ) {
          insertIndex = i + 1
        } else if (lines[i].trim() === '' && insertIndex > 0) {
          continue
        } else {
          break
        }
      }
      lines.splice(insertIndex, 0, importLine)
      converted = lines.join('\n')
    }
  }

  // Convert jest.mock calls to mock.module calls
  converted = converted.replace(
    /jest\.mock\(['"]([^'"]+)['"]\)/g,
    (match, modulePath) => {
      // Simple mock without implementation
      return `mock.module('${modulePath}', () => ({}))`
    }
  )

  // Convert jest.mock calls with implementations
  converted = converted.replace(
    /jest\.mock\(['"]([^'"]+)['"],\s*\(\)\s*=>\s*\{([^}]+)\}\)/gs,
    (match, modulePath, implementation) => {
      return `mock.module('${modulePath}', () => {\n${implementation}\n})`
    }
  )

  // Convert jest.fn() to mock()
  converted = converted.replace(/jest\.fn\(\)/g, 'mock()')
  converted = converted.replace(/jest\.fn\(/g, 'mock(')

  // Convert jest.spyOn to spyOn
  converted = converted.replace(/jest\.spyOn/g, 'spyOn')

  // Convert jest.clearAllMocks() to individual mock clears
  // This is more complex and we'll handle it case by case

  // Convert it() to test()
  converted = converted.replace(/\bit\(/g, 'test(')

  // Convert jest.Mock type annotations
  converted = converted.replace(/as jest\.Mock/g, 'as any')
  converted = converted.replace(/jest\.Mock/g, 'any')
  converted = converted.replace(/jest\.Mocked<([^>]+)>/g, '$1')

  // Convert jest timer functions
  converted = converted.replace(
    /jest\.useFakeTimers\(\)/g,
    '// jest.useFakeTimers() - TODO: Convert to bun equivalent'
  )
  converted = converted.replace(
    /jest\.useRealTimers\(\)/g,
    '// jest.useRealTimers() - TODO: Convert to bun equivalent'
  )

  // Handle common logger mock patterns
  if (converted.includes("jest.mock('../../src/config/logger')")) {
    converted = converted.replace(
      "mock.module('../../src/config/logger', () => ({}))",
      `mock.module('../../src/config/logger', () => ({
  default: {
    info: mock(() => {}),
    error: mock(() => {}),
    warn: mock(() => {}),
    debug: mock(() => {})
  }
}))`
    )
  }

  // Handle database factory mock patterns
  if (converted.includes("jest.mock('../../src/services/database/factory')")) {
    // Look for mockDatabase definitions and convert them
    const mockDatabaseMatch = converted.match(/const mockDatabase = \{[\s\S]*?\}/m)
    if (mockDatabaseMatch) {
      const mockDatabaseDef = mockDatabaseMatch[0]
      converted = converted.replace(
        "mock.module('../../src/services/database/factory', () => ({}))",
        `// Mock the database factory
mock.module('../../src/services/database/factory', () => ({
  getDatabase: mock(() => mockDatabase)
}))`
      )

      // Convert jest.fn() calls in the mockDatabase object
      converted = converted.replace(
        mockDatabaseDef,
        mockDatabaseDef.replace(/jest\.fn\(\)/g, 'mock()')
      )
    }
  }

  // Handle specific mock variable conversions
  const mockVarPattern =
    /const (\w+) = (\w+) as jest\.Mock\s*\n\s*\1\.mockReturnValue\(([^)]+)\)/g
  converted = converted.replace(
    mockVarPattern,
    (match, varName, originalVar, returnValue) => {
      return `// ${varName} is mocked via mock.module above`
    }
  )

  // Convert jest.clearAllMocks() in afterEach
  converted = converted.replace(
    /afterEach\(\(\) => \{\s*jest\.clearAllMocks\(\)\s*\}\)/g,
    `afterEach(() => {
    // Clear individual mocks as needed
  })`
  )

  // Convert remaining jest.clearAllMocks() calls
  converted = converted.replace(
    /jest\.clearAllMocks\(\)/g,
    '// Clear individual mocks as needed'
  )

  return converted
}

async function processFile(filePath: string): Promise<void> {
  stats.filesProcessed++

  try {
    const content = fs.readFileSync(filePath, 'utf8')

    // Skip if already converted or doesn't use Jest
    if (!content.includes('jest.') && !content.includes('it(')) {
      return
    }

    // Skip if already uses bun:test
    if (content.includes("from 'bun:test'")) {
      return
    }

    console.log(`Converting: ${filePath}`)

    const converted = convertJestToBun(content, filePath)

    // Create backup
    const backupPath = `${filePath}.backup`
    fs.writeFileSync(backupPath, content)

    // Write converted content
    fs.writeFileSync(filePath, converted)

    stats.filesConverted++
    console.log(`✓ Converted: ${filePath}`)
  } catch (error) {
    const errorMsg = `Error processing ${filePath}: ${error}`
    stats.errors.push(errorMsg)
    console.error(errorMsg)
  }
}

async function main() {
  console.log('🔄 Converting Jest tests to bun:test...\n')

  const testDir = path.join(process.cwd(), 'test')

  // Recursively find all .test.ts files
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

  const testFiles = findTestFiles(testDir)

  console.log(`Found ${testFiles.length} test files\n`)

  for (const fullPath of testFiles) {
    await processFile(fullPath)
  }

  console.log('\n📊 Conversion Summary:')
  console.log(`Files processed: ${stats.filesProcessed}`)
  console.log(`Files converted: ${stats.filesConverted}`)
  console.log(`Errors: ${stats.errors.length}`)

  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:')
    stats.errors.forEach((error) => console.log(`  ${error}`))
  }

  if (stats.filesConverted > 0) {
    console.log('\n✨ Conversion complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Review converted files and fix any remaining issues')
    console.log('2. Update jest.clearAllMocks() calls to clear individual mocks')
    console.log('3. Handle any complex mock scenarios manually')
    console.log('4. Run tests: bun test')
    console.log('5. Remove backup files when satisfied: rm **/*.backup')
  }
}

if (import.meta.main) {
  main().catch(console.error)
}

#!/usr/bin/env bun
/**
 * Simplified Bun Test Runner with Jest Compatibility
 *
 * Uses Bun's Jest compatibility mode to run existing Jest-style tests
 * without requiring complex migration of test files.
 */

import { spawnSync } from 'child_process'
import { existsSync } from 'fs'

interface TestOptions {
  watch?: boolean
  coverage?: boolean
  verbose?: boolean
  silent?: boolean
  bail?: boolean
  watchAll?: boolean
}

class BunJestRunner {
  private options: TestOptions = {}

  constructor(args: string[] = []) {
    this.parseArgs(args)
  }

  private parseArgs(args: string[]): void {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i]

      switch (arg) {
        case '--watch':
        case '-w':
          this.options.watch = true
          break
        case '--watchAll':
          this.options.watchAll = true
          break
        case '--watchAll=false':
          this.options.watchAll = false
          this.options.watch = false
          break
        case '--coverage':
          this.options.coverage = true
          break
        case '--verbose':
          this.options.verbose = true
          break
        case '--silent':
          this.options.silent = true
          break
        case '--bail':
          this.options.bail = true
          break
        case '--forceExit':
        case '--detectOpenHandles':
        case '--maxWorkers=1':
          // Legacy Jest options - ignore as Bun handles these automatically
          break
      }
    }

    // Default watch behavior
    if (
      !process.env.CI &&
      this.options.watchAll === undefined &&
      this.options.watch === undefined
    ) {
      this.options.watch = true
    }
  }

  private setupEnvironment(): void {
    // Set test environment variables
    process.env.NODE_ENV = 'test'
    process.env.BABEL_ENV = 'test'
    process.env.PUBLIC_URL = ''
  }

  private async runPreflightChecks(): Promise<void> {
    if (this.options.silent) return

    console.log('🧪 Running preflight checks...\n')

    // Type checking
    if (existsSync('./tsconfig.json')) {
      console.log('📝 Type checking...')
      try {
        const typeCheck = spawnSync('bun', ['run', 'type-check'], {
          stdio: 'inherit'
        })

        if (typeCheck.status !== 0) {
          console.error('❌ Type check failed')
          process.exit(1)
        } else {
          console.log('✅ Type check passed')
        }
      } catch (error) {
        console.warn('⚠️ Type checking skipped:', error.message)
      }
    }

    // Linting
    console.log('🔍 Linting...')
    try {
      const lint = spawnSync('bun', ['run', 'lint'], {
        stdio: 'inherit'
      })

      if (lint.status !== 0) {
        console.error('❌ Linting failed')
        process.exit(1)
      } else {
        console.log('✅ Linting passed')
      }
    } catch (error) {
      console.warn('⚠️ Linting skipped:', error.message)
    }

    // Format check
    console.log('💅 Format checking...')
    try {
      const format = spawnSync('bun', ['run', 'format:check'], {
        stdio: 'inherit'
      })

      if (format.status !== 0) {
        console.error('❌ Format check failed')
        console.log('💡 Run: bun run format')
        process.exit(1)
      } else {
        console.log('✅ Format check passed')
      }
    } catch (error) {
      console.warn('⚠️ Format checking skipped:', error.message)
    }

    console.log('')
  }

  private buildJestCommand(): { command: string; args: string[] } {
    const args: string[] = []

    // Test pattern - Jest will find spec files automatically
    args.push('--testMatch', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}')

    // Watch mode
    if (this.options.watchAll) {
      args.push('--watchAll')
    } else if (this.options.watch) {
      args.push('--watch')
    } else {
      args.push('--watchAll=false')
    }

    // Coverage
    if (this.options.coverage) {
      args.push('--coverage')
    }

    // Verbose mode
    if (this.options.verbose) {
      args.push('--verbose')
    }

    // Silent mode
    if (this.options.silent) {
      args.push('--silent')
    }

    // Bail on first failure
    if (this.options.bail) {
      args.push('--bail')
    }

    // Force exit and handle detection for CI
    if (process.env.CI || !this.options.watch) {
      args.push('--forceExit', '--detectOpenHandles', '--maxWorkers=1')
    }

    return { command: 'bunx', args: ['jest', ...args] }
  }

  async run(): Promise<void> {
    if (!this.options.silent) {
      console.log('🏃‍♂️ Bun Jest Test Runner\n')
    }

    // Setup test environment
    this.setupEnvironment()

    // Run preflight checks (validation)
    await this.runPreflightChecks()

    // Build and run Jest command through Bun
    const { command, args } = this.buildJestCommand()

    if (this.options.verbose && !this.options.silent) {
      console.log('📋 Command:', [command, ...args].join(' '))
    }

    if (!this.options.silent) {
      console.log('🧪 Running tests...\n')
    }

    try {
      const result = spawnSync(command, args, {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: {
          ...process.env,
          // Ensure Bun uses Jest compatibility mode
          FORCE_COLOR: '1'
        }
      })

      if (result.status !== 0) {
        if (!this.options.silent) {
          console.error('\n❌ Tests failed')
        }
        process.exit(result.status || 1)
      } else {
        if (!this.options.silent) {
          console.log('\n✅ All tests passed!')
        }
      }
    } catch (error) {
      console.error('❌ Test runner failed:', error.message)

      if (!this.options.silent) {
        console.log('\n💡 Troubleshooting:')
        console.log('   • Ensure Bun v1.0+ is installed: bun --version')
        console.log('   • Try: bun install (to ensure dependencies are correct)')
        console.log('   • Check Jest configuration in package.json')
      }

      process.exit(1)
    }
  }
}

// CLI execution
if (import.meta.main) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Bun Jest Test Runner

Usage:
  bun test.ts [options]

Options:
  --watch, -w          Watch files for changes
  --watchAll           Watch all files
  --watchAll=false     Disable watch mode (for CI)
  --coverage           Generate coverage report
  --verbose            Verbose output
  --silent             Suppress output except errors
  --bail               Stop on first test failure

Examples:
  bun test.ts                           # Run all tests (watch mode in dev)
  bun test.ts --watchAll=false         # CI mode - run once
  bun test.ts --coverage               # With coverage report
  bun test.ts --silent --watchAll=false # Silent CI mode
`)
    process.exit(0)
  }

  const runner = new BunJestRunner(args)
  runner.run().catch(error => {
    console.error('Test runner failed:', error)
    process.exit(1)
  })
}

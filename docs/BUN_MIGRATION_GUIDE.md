# Bun Migration Guide

## Overview

This document outlines the complete migration process for converting the Kyan Jukebox monorepo from Node.js/Yarn to Bun 1.3+.

**Current Architecture:**
- Yarn workspace monorepo
- Frontend: React/TypeScript with custom webpack
- Backend: Node.js/TypeScript with ts-node-dev
- Docker deployment with separate containers
- Justfile for task automation

**Target Architecture:**
- Bun workspace monorepo
- Frontend: React/TypeScript with Bun bundler or webpack
- Backend: TypeScript with native Bun execution
- Docker deployment with Bun runtime
- Updated justfile for Bun commands

## Prerequisites

- Bun 1.3+ installed globally
- Git backup of current state
- Docker updated to support Bun images

## Migration Phases

### Phase 1: Backup and Preparation

```bash
# 1. Create comprehensive backup
git checkout -b bun-migration
cp yarn.lock yarn.lock.backup
cp package.json package.json.backup
cp frontend/package.json frontend/package.json.backup
cp backend/package.json backend/package.json.backup

# 2. Clean workspace
rm -rf node_modules frontend/node_modules backend/node_modules
rm yarn.lock
```

### Phase 2: Package Manager Migration

```bash
# 1. Install with Bun (preserves workspace structure)
bun install

# 2. Verify workspace detection
bun --filter frontend run --help
bun --filter backend run --help

# 3. Test basic commands
bun --filter frontend install
bun --filter backend install
```

### Phase 3: Backend Migration

#### 3.1 Update Backend Scripts

Update `backend/package.json` scripts:

```json
{
  "scripts": {
    "build": "bun build src/index.ts --outdir dist --target node",
    "start": "bun --watch src/index.ts",
    "start:prod": "bun dist/index.js",
    "test": "bun run validate && bun test",
    "jest": "bun run --bun jest --forceExit --detectOpenHandles --verbose"
  }
}
```

#### 3.2 Replace ts-node-dev

Replace `ts-node-dev` dependency and usage:
- Remove `ts-node-dev` from devDependencies
- Update start script to use `bun --watch`
- Verify hot reload functionality

#### 3.3 Database Integration

Verify `better-sqlite3` compatibility:
```bash
cd backend
bun add better-sqlite3
bun run start
```

### Phase 4: Frontend Migration Options

#### Option A: Keep Webpack (Safer)

```json
{
  "scripts": {
    "start": "bun run scripts/start.js",
    "build": "bun run scripts/build.js",
    "test": "bun run validate && bun run scripts/test.js"
  }
}
```

#### Option B: Migrate to Bun Bundler (Recommended)

Create `frontend/build.ts`:
```typescript
import { build } from 'bun';

await build({
  entrypoints: ['./src/index.tsx'],
  outdir: './build',
  target: 'browser',
  splitting: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production' ? 'linked' : false,
});
```

Update `frontend/package.json`:
```json
{
  "scripts": {
    "start": "bun --watch build.ts",
    "build": "NODE_ENV=production bun build.ts",
    "test": "bun test"
  }
}
```

### Phase 5: Update Root Configuration

#### 5.1 Update Root Package.json

```json
{
  "name": "@jukebox/base",
  "workspaces": ["frontend", "backend"],
  "scripts": {
    "test:frontend": "bun --filter @jukebox/frontend test:ci",
    "test:backend": "bun --filter @jukebox/backend test:ci",
    "dev": "bun --filter '*' start",
    "build": "bun --filter '*' build"
  },
  "trustedDependencies": ["better-sqlite3", "node-sass"]
}
```

#### 5.2 Create bunfig.toml (Optional)

```toml
[install]
# Link workspace packages
linkWorkspacePackages = true

# Faster installs
cache = true
registry = "https://registry.npmjs.org/"

[install.scopes]
# Private registry setup if needed
# "@myorg" = "https://npm.myorg.com/"
```

### Phase 6: Update Justfile

Replace Yarn commands with Bun equivalents:

```justfile
# Install dependencies and start development environment
[group('setup')]
setup:
  bun install --frozen-lockfile
  just deps-start

# Start full development environment
[group('dev')]
dev:
  bun --filter '*' start

# Build both frontend and backend
[group('build')]
build-all:
  bun --filter @jukebox/backend build
  bun --filter @jukebox/frontend build

# Run all tests
[group('test')]
test:
  bun --filter @jukebox/frontend test:ci
  bun --filter @jukebox/backend test:ci

# Run workspace command
[group('dev')]
fe TASK="start":
  bun --filter @jukebox/frontend {{TASK}}

[group('dev')]
be TASK="start":
  bun --filter @jukebox/backend {{TASK}}
```

### Phase 7: Docker Migration

#### 7.1 Update Backend Dockerfile

```dockerfile
FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY backend/package.json ./backend/
RUN bun install --frozen-lockfile

# Copy source
COPY backend ./backend

# Build
WORKDIR /app/backend
RUN bun run build

# Production stage
FROM oven/bun:1.3-alpine
WORKDIR /app
COPY --from=base /app/backend/dist ./
COPY --from=base /app/backend/package.json ./

EXPOSE 8080
CMD ["bun", "index.js"]
```

#### 7.2 Update Frontend Dockerfile

For Bun bundler option:
```dockerfile
FROM oven/bun:1.3-alpine AS build
WORKDIR /app

COPY package.json bun.lockb ./
COPY frontend/package.json ./frontend/
RUN bun install --frozen-lockfile

COPY frontend ./frontend
WORKDIR /app/frontend
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
```

### Phase 8: Testing and Validation

#### 8.1 Development Testing

```bash
# Test backend hot reload
cd backend && bun --watch src/index.ts

# Test frontend development
cd frontend && bun start

# Test workspace commands
bun --filter '*' start
```

#### 8.2 Build Testing

```bash
# Test production builds
just build-all

# Test Docker builds
just docker-build-all

# Test full workflow
just clean && just setup && just test
```

#### 8.3 Performance Comparison

Benchmark before/after:
- Install time: `time bun install` vs `time yarn install`
- Build time: Backend TypeScript compilation
- Test execution time
- Docker build time

### Phase 9: CI/CD Updates

Update GitHub Actions workflow:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bun run test
      - run: bun run build
```

## Rollback Plan

If migration fails:

```bash
# 1. Restore backup files
cp yarn.lock.backup yarn.lock
cp package.json.backup package.json
cp frontend/package.json.backup frontend/package.json
cp backend/package.json.backup backend/package.json

# 2. Clean and reinstall with Yarn
rm -rf node_modules frontend/node_modules backend/node_modules bun.lockb
yarn install

# 3. Verify functionality
just test
just build-all
```

## Common Issues and Solutions

### Issue: SQLite Native Module
**Problem**: `better-sqlite3` compilation issues
**Solution**:
```bash
bun add better-sqlite3
# Or use Bun's SQLite API instead
```

### Issue: Jest Compatibility
**Problem**: Jest tests failing with Bun
**Solution**: Use `--bun` flag or migrate to Bun's test runner

### Issue: Webpack Configuration
**Problem**: Complex webpack setup doesn't work with Bun
**Solution**: Keep webpack initially, migrate to Bun bundler later

### Issue: Docker Build Context
**Problem**: `bun.lockb` not found in Docker
**Solution**: Ensure lockfile is in correct location and not gitignored

## Success Criteria

- [ ] All existing tests pass
- [ ] Development hot reload works for both frontend/backend
- [ ] Production builds generate correct output
- [ ] Docker containers build and run successfully
- [ ] Performance improvements observed (install/build times)
- [ ] No functionality regressions

## Performance Expectations

Expected improvements:
- **Install time**: 50-70% faster than Yarn
- **TypeScript execution**: 20-30% faster than ts-node
- **Bundle time**: 30-50% faster than webpack (if using Bun bundler)
- **Test execution**: 10-20% faster
- **Docker build**: 20-40% faster

## Next Steps After Migration

1. **Optimize further**: Explore Bun-specific optimizations
2. **Update documentation**: README, deployment guides
3. **Team training**: Ensure team understands new commands
4. **Monitor performance**: Track actual vs expected improvements
5. **Consider Bun APIs**: Migrate to native Bun APIs where beneficial

## Commands Quick Reference

| Task | Yarn Command | Bun Equivalent |
|------|-------------|----------------|
| Install | `yarn install` | `bun install` |
| Add dependency | `yarn workspace @jukebox/backend add lodash` | `bun --filter @jukebox/backend add lodash` |
| Run script | `yarn workspace @jukebox/frontend start` | `bun --filter @jukebox/frontend start` |
| Run in all workspaces | `yarn workspaces run test` | `bun --filter '*' test` |
| Install frozen | `yarn install --frozen-lockfile` | `bun install --frozen-lockfile` |

---

**Migration Owner**: [Your Name]
**Created**: [Date]
**Bun Version**: 1.3+
**Status**: Planning Phase

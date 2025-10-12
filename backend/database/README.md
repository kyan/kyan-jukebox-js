# Database Schema

This directory contains the database schema and related files for the Kyan Jukebox SQLite database.

## Files

- `schema.sql` - Complete database schema definition including all tables, indexes, triggers, and views

## Database Structure

The schema defines the following main tables:

### Core Tables

- **users** - User accounts and profiles
- **tracks** - Music tracks with metadata, metrics, and JSON fields for complex data
- **settings** - Application configuration stored as key-value pairs with JSON values
- **events** - User activity logging and analytics
- **images** - Image URL caching with expiration

### System Tables

- **schema_version** - Tracks schema version for database migrations

## Usage

### Creating a New Database

Use the SQLite helper script to create a new database:

```bash
# Create development database
./scripts/sqlite-helper.sh create dev

# Create production database
./scripts/sqlite-helper.sh create prod
```

### Manual Schema Application

If you need to apply the schema manually:

```bash
sqlite3 databases/jukebox.db < backend/database/schema.sql
```

## Schema Features

### Performance Optimizations

- WAL mode enabled for better concurrent access
- Comprehensive indexing strategy including JSON path indexes
- Optimized SQLite settings for performance

### JSON Support

The schema makes extensive use of SQLite's JSON support for flexible data storage:

- Track metadata (artist, album information)
- Track metrics (plays, votes, averages)
- User arrays (added_by, genres)
- Settings configuration

### Views

Includes helper views for easier querying:

- `tracks_view` - Flattened track data with extracted JSON fields
- `recent_events_view` - Recent events with user information

### Triggers

Automatic timestamp management:

- `updated_at` triggers for all main tables
- Migration logging triggers for schema version tracking

## Maintenance

The schema includes built-in optimization and maintenance features:

- `ANALYZE` command run after schema creation
- Proper foreign key constraints
- Indexes designed for common query patterns

## Schema Versioning

The schema includes a versioning system to track database migrations and updates. The current schema is version 1.
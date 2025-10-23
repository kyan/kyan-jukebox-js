-- Kyan Jukebox Database Schema
-- This script creates the complete database schema for the Kyan Jukebox application

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Enable WAL mode for better concurrent access
PRAGMA journal_mode = WAL;

-- Optimize SQLite for performance
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = memory;
PRAGMA mmap_size = 268435456; -- 256MB

-- Create database version tracking table
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Insert initial schema version
INSERT OR IGNORE INTO schema_version (version, description)
VALUES (1, 'Initial database schema');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_fullname ON users(fullname);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Users trigger
CREATE TRIGGER IF NOT EXISTS users_updated_at
    AFTER UPDATE ON users
    FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================================================
-- TRACKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tracks (
    uri TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    length INTEGER,
    year TEXT,
    image TEXT,
    album JSON,
    artist JSON,
    added_by JSON DEFAULT '[]',
    metrics JSON DEFAULT '{"plays":0,"votes":0,"votesTotal":0,"votesAverage":0}',
    explicit BOOLEAN DEFAULT FALSE,
    genres JSON DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tracks basic indexes
CREATE INDEX IF NOT EXISTS idx_tracks_name ON tracks(name);
CREATE INDEX IF NOT EXISTS idx_tracks_year ON tracks(year);
CREATE INDEX IF NOT EXISTS idx_tracks_length ON tracks(length);
CREATE INDEX IF NOT EXISTS idx_tracks_explicit ON tracks(explicit);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at);

-- Tracks JSON path indexes
CREATE INDEX IF NOT EXISTS idx_tracks_artist_name ON tracks(json_extract(artist, '$.name'));
CREATE INDEX IF NOT EXISTS idx_tracks_album_name ON tracks(json_extract(album, '$.name'));
CREATE INDEX IF NOT EXISTS idx_tracks_metrics_plays ON tracks(json_extract(metrics, '$.plays'));
CREATE INDEX IF NOT EXISTS idx_tracks_metrics_votes ON tracks(json_extract(metrics, '$.votes'));
CREATE INDEX IF NOT EXISTS idx_tracks_metrics_average ON tracks(json_extract(metrics, '$.votesAverage'));

-- Tracks composite indexes
CREATE INDEX IF NOT EXISTS idx_tracks_artist_album ON tracks(
    json_extract(artist, '$.name'),
    json_extract(album, '$.name')
);

CREATE INDEX IF NOT EXISTS idx_tracks_plays_votes ON tracks(
    json_extract(metrics, '$.plays'),
    json_extract(metrics, '$.votes')
);

CREATE INDEX IF NOT EXISTS idx_tracks_recommendation ON tracks(
    json_extract(metrics, '$.votesAverage') DESC,
    json_extract(metrics, '$.plays') ASC
);

-- Tracks trigger
CREATE TRIGGER IF NOT EXISTS tracks_updated_at
    AFTER UPDATE ON tracks
    FOR EACH ROW
BEGIN
    UPDATE tracks SET updated_at = CURRENT_TIMESTAMP WHERE uri = NEW.uri;
END;

-- ============================================================================
-- SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);

-- Settings JSON path indexes
CREATE INDEX IF NOT EXISTS idx_settings_current_track ON settings(json_extract(value, '$.currentTrack'))
    WHERE key = 'state';

CREATE INDEX IF NOT EXISTS idx_settings_tracklist_length ON settings(json_array_length(json_extract(value, '$.currentTracklist')))
    WHERE key = 'state';

CREATE INDEX IF NOT EXISTS idx_settings_seeds_length ON settings(json_array_length(json_extract(value, '$.trackSeeds')))
    WHERE key = 'state';

-- Settings trigger
CREATE TRIGGER IF NOT EXISTS settings_updated_at
    AFTER UPDATE ON settings
    FOR EACH ROW
BEGIN
    UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
END;

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    payload JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_key ON events(key);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_created ON events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_key ON events(user_id, key);
CREATE INDEX IF NOT EXISTS idx_events_key_created ON events(key, created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_key_created ON events(user_id, key, created_at);
CREATE INDEX IF NOT EXISTS idx_events_recent ON events(created_at DESC);

-- ============================================================================
-- IMAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS images (
    uri TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    expire_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Images indexes
CREATE INDEX IF NOT EXISTS idx_images_uri ON images(uri);
CREATE INDEX IF NOT EXISTS idx_images_expire_at ON images(expire_at);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at);

-- Index for cleanup operations (finding expired images)
CREATE INDEX IF NOT EXISTS idx_images_expired ON images(expire_at);

-- Images trigger
CREATE TRIGGER IF NOT EXISTS images_updated_at
    AFTER UPDATE ON images
    FOR EACH ROW
BEGIN
    UPDATE images SET updated_at = CURRENT_TIMESTAMP WHERE uri = NEW.uri;
END;

-- ============================================================================
-- VIEWS (Optional - for easier querying)
-- ============================================================================

-- View for tracks with extracted JSON data
CREATE VIEW IF NOT EXISTS tracks_view AS
SELECT
    uri,
    name,
    length,
    year,
    image,
    json_extract(artist, '$.name') as artist_name,
    json_extract(artist, '$.uri') as artist_uri,
    json_extract(album, '$.name') as album_name,
    json_extract(album, '$.uri') as album_uri,
    json_extract(metrics, '$.plays') as plays,
    json_extract(metrics, '$.votes') as votes,
    json_extract(metrics, '$.votesTotal') as votes_total,
    json_extract(metrics, '$.votesAverage') as votes_average,
    explicit,
    created_at,
    updated_at
FROM tracks;

-- View for recent events with user information
CREATE VIEW IF NOT EXISTS recent_events_view AS
SELECT
    e.id,
    e.user_id,
    u.fullname as user_name,
    u.email as user_email,
    e.key,
    e.payload,
    e.created_at
FROM events e
LEFT JOIN users u ON e.user_id = u.id
ORDER BY e.created_at DESC;

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Update schema version to indicate completion
UPDATE schema_version SET applied_at = CURRENT_TIMESTAMP WHERE version = 1;

-- Analyze tables for query optimization
ANALYZE;

-- Success message (will be displayed when script runs)
SELECT 'Database schema created successfully!' as message;

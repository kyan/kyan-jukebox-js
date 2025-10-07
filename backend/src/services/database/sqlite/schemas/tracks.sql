-- Tracks table schema
-- Stores track information with complex nested data in JSON columns

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

-- Basic indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_tracks_name ON tracks(name);
CREATE INDEX IF NOT EXISTS idx_tracks_year ON tracks(year);
CREATE INDEX IF NOT EXISTS idx_tracks_length ON tracks(length);
CREATE INDEX IF NOT EXISTS idx_tracks_explicit ON tracks(explicit);
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at);

-- JSON path indexes for nested data queries
CREATE INDEX IF NOT EXISTS idx_tracks_artist_name ON tracks(json_extract(artist, '$.name'));
CREATE INDEX IF NOT EXISTS idx_tracks_album_name ON tracks(json_extract(album, '$.name'));
CREATE INDEX IF NOT EXISTS idx_tracks_metrics_plays ON tracks(json_extract(metrics, '$.plays'));
CREATE INDEX IF NOT EXISTS idx_tracks_metrics_votes ON tracks(json_extract(metrics, '$.votes'));
CREATE INDEX IF NOT EXISTS idx_tracks_metrics_average ON tracks(json_extract(metrics, '$.votesAverage'));

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tracks_artist_album ON tracks(
    json_extract(artist, '$.name'),
    json_extract(album, '$.name')
);

CREATE INDEX IF NOT EXISTS idx_tracks_plays_votes ON tracks(
    json_extract(metrics, '$.plays'),
    json_extract(metrics, '$.votes')
);

-- Index for recommendation queries (high votes, low plays)
CREATE INDEX IF NOT EXISTS idx_tracks_recommendation ON tracks(
    json_extract(metrics, '$.votesAverage') DESC,
    json_extract(metrics, '$.plays') ASC
);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS tracks_updated_at
    AFTER UPDATE ON tracks
    FOR EACH ROW
BEGIN
    UPDATE tracks SET updated_at = CURRENT_TIMESTAMP WHERE uri = NEW.uri;
END;

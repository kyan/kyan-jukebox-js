-- Events table schema
-- Stores user activity logs with JSON payloads for analytics and debugging

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    payload JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_key ON events(key);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_created ON events(user_id, created_at);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_user_key ON events(user_id, key);
CREATE INDEX IF NOT EXISTS idx_events_key_created ON events(key, created_at);
CREATE INDEX IF NOT EXISTS idx_events_user_key_created ON events(user_id, key, created_at);

-- Index for recent events queries
CREATE INDEX IF NOT EXISTS idx_events_recent ON events(created_at DESC);

-- JSON path indexes for common payload queries (if needed)
-- These can be added later based on specific payload structure usage
-- CREATE INDEX IF NOT EXISTS idx_events_payload_type ON events(json_extract(payload, '$.type'));
-- CREATE INDEX IF NOT EXISTS idx_events_payload_action ON events(json_extract(payload, '$.action'));

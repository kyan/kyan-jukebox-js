-- Settings table schema
-- Stores application settings as key-value pairs with JSON values

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);

-- JSON path indexes for common setting queries
CREATE INDEX IF NOT EXISTS idx_settings_current_track ON settings(json_extract(value, '$.currentTrack'))
    WHERE key = 'state';

CREATE INDEX IF NOT EXISTS idx_settings_tracklist_length ON settings(json_array_length(json_extract(value, '$.currentTracklist')))
    WHERE key = 'state';

CREATE INDEX IF NOT EXISTS idx_settings_seeds_length ON settings(json_array_length(json_extract(value, '$.trackSeeds')))
    WHERE key = 'state';

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS settings_updated_at
    AFTER UPDATE ON settings
    FOR EACH ROW
BEGIN
    UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE key = NEW.key;
END;

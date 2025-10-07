-- Images table schema
-- Stores temporary image cache with expiration dates for automatic cleanup

CREATE TABLE IF NOT EXISTS images (
    uri TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    expire_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_images_uri ON images(uri);
CREATE INDEX IF NOT EXISTS idx_images_expire_at ON images(expire_at);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at);

-- Index for cleanup operations (finding expired images)
CREATE INDEX IF NOT EXISTS idx_images_expired ON images(expire_at)
    WHERE expire_at <= datetime('now');

-- Index for active images (not expired)
CREATE INDEX IF NOT EXISTS idx_images_active ON images(expire_at)
    WHERE expire_at > datetime('now');

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS images_updated_at
    AFTER UPDATE ON images
    FOR EACH ROW
BEGIN
    UPDATE images SET updated_at = CURRENT_TIMESTAMP WHERE uri = NEW.uri;
END;

-- Optional: Trigger to automatically delete expired images
-- (Can be enabled if automatic cleanup is desired)
-- CREATE TRIGGER IF NOT EXISTS images_auto_cleanup
--     AFTER INSERT ON images
--     FOR EACH ROW
-- BEGIN
--     DELETE FROM images WHERE expire_at <= datetime('now');
-- END;

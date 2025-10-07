-- Migration version tracking system
-- This script manages database schema versioning for safe migrations and rollbacks

-- Create migration version tracking table
CREATE TABLE IF NOT EXISTS migration_versions (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    rollback_sql TEXT,
    checksum TEXT
);

-- Create migration log table for detailed tracking
CREATE TABLE IF NOT EXISTS migration_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('apply', 'rollback')),
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    error_message TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (version) REFERENCES migration_versions(version)
);

-- Indexes for migration tracking
CREATE INDEX IF NOT EXISTS idx_migration_versions_applied_at ON migration_versions(applied_at);
CREATE INDEX IF NOT EXISTS idx_migration_log_version ON migration_log(version);
CREATE INDEX IF NOT EXISTS idx_migration_log_action ON migration_log(action);
CREATE INDEX IF NOT EXISTS idx_migration_log_status ON migration_log(status);
CREATE INDEX IF NOT EXISTS idx_migration_log_started_at ON migration_log(started_at);

-- Insert initial migration record
INSERT OR IGNORE INTO migration_versions (version, name, description, checksum)
VALUES (
    1,
    'initial_schema',
    'Initial database schema with users, tracks, settings, events, and images tables',
    'sha256:initial'
);

-- View for migration status
CREATE VIEW IF NOT EXISTS migration_status AS
SELECT
    mv.version,
    mv.name,
    mv.description,
    mv.applied_at,
    CASE
        WHEN ml.status = 'completed' AND ml.action = 'apply' THEN 'APPLIED'
        WHEN ml.status = 'completed' AND ml.action = 'rollback' THEN 'ROLLED_BACK'
        WHEN ml.status = 'failed' THEN 'FAILED'
        WHEN ml.status = 'started' THEN 'IN_PROGRESS'
        ELSE 'PENDING'
    END as status,
    ml.error_message,
    ml.completed_at
FROM migration_versions mv
LEFT JOIN migration_log ml ON mv.version = ml.version
    AND ml.id = (
        SELECT MAX(id)
        FROM migration_log ml2
        WHERE ml2.version = mv.version
    )
ORDER BY mv.version;

-- Function to log migration start (via trigger)
CREATE TRIGGER IF NOT EXISTS log_migration_start
    AFTER INSERT ON migration_versions
    FOR EACH ROW
BEGIN
    INSERT INTO migration_log (version, action, status)
    VALUES (NEW.version, 'apply', 'started');
END;

-- Function to log migration completion (via trigger)
CREATE TRIGGER IF NOT EXISTS log_migration_complete
    AFTER UPDATE OF applied_at ON migration_versions
    FOR EACH ROW
    WHEN NEW.applied_at != OLD.applied_at
BEGIN
    UPDATE migration_log
    SET status = 'completed', completed_at = CURRENT_TIMESTAMP
    WHERE version = NEW.version
    AND action = 'apply'
    AND status = 'started';
END;

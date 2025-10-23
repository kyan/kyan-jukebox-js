#!/bin/bash
# SQLite Database Helper Script for Kyan Jukebox
# This script provides common database management tasks

set -e

# Configuration
DEV_DB_PATH="./databases/jukebox.db"
PROD_DB_PATH="/var/lib/jukebox/jukebox.db"
BACKUP_DIR="./backups"
SCHEMA_PATH="./backend/database/schema.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Show usage
show_help() {
    echo "SQLite Database Helper for Kyan Jukebox"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  status                     Show database status and info"
    echo "  backup [dev|prod]          Create backup of database"
    echo "  restore <backup_file>      Restore database from backup"
    echo "  copy-to-prod              Copy development database to production location"
    echo "  copy-from-prod            Copy production database to development location"
    echo "  vacuum [dev|prod]         Optimize database (VACUUM)"
    echo "  schema [dev|prod]          Show database schema"
    echo "  size [dev|prod]           Show database file size"
    echo "  init                      Initialize development database directory"
    echo "  create [dev|prod]         Create new database with schema"
    echo "  reset [dev|prod]          Reset database (backup and recreate)"
    echo ""
    echo "Examples:"
    echo "  $0 status                 # Show status of both databases"
    echo "  $0 backup dev             # Backup development database"
    echo "  $0 create dev             # Create new development database with schema"
    echo "  $0 reset dev              # Reset development database"
    echo "  $0 copy-to-prod           # Copy dev DB to production location"
    echo "  $0 vacuum dev             # Optimize development database"
}

# Initialize development environment
init_dev() {
    log_info "Initializing development database environment..."

    # Create databases directory if it doesn't exist
    if [ ! -d "./databases" ]; then
        mkdir -p ./databases
        log_success "Created databases directory"
    fi

    # Create backup directory if it doesn't exist
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p $BACKUP_DIR
        log_success "Created backup directory"
    fi

    log_success "Development environment initialised"
}

# Show database status
show_status() {
    log_info "Database Status:"
    echo ""

    # Development database
    echo "Development Database:"
    if [ -f "$DEV_DB_PATH" ]; then
        log_success "  Path: $DEV_DB_PATH"
        echo "  Size: $(du -h "$DEV_DB_PATH" | cut -f1)"
        echo "  Modified: $(stat -f "%Sm" "$DEV_DB_PATH" 2>/dev/null || stat -c "%y" "$DEV_DB_PATH" 2>/dev/null || echo "Unknown")"
    else
        log_warning "  Not found at $DEV_DB_PATH"
    fi

    echo ""

    # Production database
    echo "Production Database:"
    if [ -f "$PROD_DB_PATH" ]; then
        log_success "  Path: $PROD_DB_PATH"
        echo "  Size: $(du -h "$PROD_DB_PATH" | cut -f1)"
        echo "  Modified: $(stat -f "%Sm" "$PROD_DB_PATH" 2>/dev/null || stat -c "%y" "$PROD_DB_PATH" 2>/dev/null || echo "Unknown")"
    else
        log_warning "  Not found at $PROD_DB_PATH"
    fi
}

# Backup database
backup_db() {
    local target=${1:-"dev"}
    local timestamp=$(date +"%Y%m%d_%H%M%S")

    # Ensure backup directory exists
    mkdir -p "$BACKUP_DIR"

    if [ "$target" = "dev" ]; then
        local db_path="$DEV_DB_PATH"
        local backup_file="$BACKUP_DIR/jukebox_dev_$timestamp.db"
    elif [ "$target" = "prod" ]; then
        local db_path="$PROD_DB_PATH"
        local backup_file="$BACKUP_DIR/jukebox_prod_$timestamp.db"
    else
        log_error "Invalid target. Use 'dev' or 'prod'"
        exit 1
    fi

    if [ ! -f "$db_path" ]; then
        log_error "Database not found at $db_path"
        exit 1
    fi

    log_info "Creating backup of $target database..."
    cp "$db_path" "$backup_file"
    log_success "Backup created: $backup_file"
}

# Restore database
restore_db() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        log_error "Please specify backup file to restore"
        exit 1
    fi

    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi

    log_warning "This will overwrite the development database!"
    read -p "Continue? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Ensure databases directory exists
        mkdir -p ./databases

        log_info "Restoring database from $backup_file..."
        cp "$backup_file" "$DEV_DB_PATH"
        log_success "Database restored to $DEV_DB_PATH"
    else
        log_info "Restore cancelled"
    fi
}

# Copy development database to production location
copy_to_prod() {
    if [ ! -f "$DEV_DB_PATH" ]; then
        log_error "Development database not found at $DEV_DB_PATH"
        exit 1
    fi

    log_warning "This will overwrite the production database!"
    read -p "Continue? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Ensure production directory exists
        sudo mkdir -p "$(dirname "$PROD_DB_PATH")"

        log_info "Copying development database to production..."
        sudo cp "$DEV_DB_PATH" "$PROD_DB_PATH"
        sudo chown app:app "$PROD_DB_PATH" 2>/dev/null || true
        log_success "Database copied to $PROD_DB_PATH"
    else
        log_info "Copy cancelled"
    fi
}

# Copy production database to development location
copy_from_prod() {
    if [ ! -f "$PROD_DB_PATH" ]; then
        log_error "Production database not found at $PROD_DB_PATH"
        exit 1
    fi

    log_warning "This will overwrite the development database!"
    read -p "Continue? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Ensure databases directory exists
        mkdir -p ./databases

        log_info "Copying production database to development..."
        sudo cp "$PROD_DB_PATH" "$DEV_DB_PATH"
        sudo chown $(whoami):$(whoami) "$DEV_DB_PATH" 2>/dev/null || true
        log_success "Database copied to $DEV_DB_PATH"
    else
        log_info "Copy cancelled"
    fi
}

# Vacuum (optimize) database
vacuum_db() {
    local target=${1:-"dev"}

    if [ "$target" = "dev" ]; then
        local db_path="$DEV_DB_PATH"
    elif [ "$target" = "prod" ]; then
        local db_path="$PROD_DB_PATH"
    else
        log_error "Invalid target. Use 'dev' or 'prod'"
        exit 1
    fi

    if [ ! -f "$db_path" ]; then
        log_error "Database not found at $db_path"
        exit 1
    fi

    log_info "Optimizing $target database..."
    sqlite3 "$db_path" "VACUUM;"
    log_success "Database optimized"
}

# Show database schema
show_schema() {
    local target=${1:-"dev"}

    if [ "$target" = "dev" ]; then
        local db_path="$DEV_DB_PATH"
    elif [ "$target" = "prod" ]; then
        local db_path="$PROD_DB_PATH"
    else
        log_error "Invalid target. Use 'dev' or 'prod'"
        exit 1
    fi

    if [ ! -f "$db_path" ]; then
        log_error "Database not found at $db_path"
        exit 1
    fi

    log_info "Database schema for $target:"
    echo ""
    sqlite3 "$db_path" ".schema"
}

# Show database size
show_size() {
    local target=${1:-"dev"}

    if [ "$target" = "dev" ]; then
        local db_path="$DEV_DB_PATH"
    elif [ "$target" = "prod" ]; then
        local db_path="$PROD_DB_PATH"
    else
        log_error "Invalid target. Use 'dev' or 'prod'"
        exit 1
    fi

    if [ ! -f "$db_path" ]; then
        log_error "Database not found at $db_path"
        exit 1
    fi

    log_info "Database size for $target:"
    echo "  File size: $(du -h "$db_path" | cut -f1)"
    echo "  Page count: $(sqlite3 "$db_path" "PRAGMA page_count;")"
    echo "  Page size: $(sqlite3 "$db_path" "PRAGMA page_size;") bytes"
}

# Create new database with schema
create_db() {
    local target=${1:-"dev"}

    if [ "$target" = "dev" ]; then
        local db_path="$DEV_DB_PATH"
    elif [ "$target" = "prod" ]; then
        local db_path="$PROD_DB_PATH"
    else
        log_error "Invalid target. Use 'dev' or 'prod'"
        exit 1
    fi

    # Check if schema file exists
    if [ ! -f "$SCHEMA_PATH" ]; then
        log_error "Schema file not found at $SCHEMA_PATH"
        exit 1
    fi

    # Check if database already exists
    if [ -f "$db_path" ]; then
        log_warning "Database already exists at $db_path"
        read -p "Overwrite existing database? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Database creation cancelled"
            return
        fi
        rm -f "$db_path"
    fi

    # Ensure directory exists
    local db_dir=$(dirname "$db_path")
    if [ "$target" = "prod" ]; then
        sudo mkdir -p "$db_dir"
    else
        mkdir -p "$db_dir"
    fi

    log_info "Creating $target database with schema..."

    if [ "$target" = "prod" ]; then
        sudo sqlite3 "$db_path" < "$SCHEMA_PATH"
        sudo chown app:app "$db_path" 2>/dev/null || true
    else
        sqlite3 "$db_path" < "$SCHEMA_PATH"
    fi

    log_success "Database created successfully at $db_path"
}

# Reset database (backup existing and create new)
reset_db() {
    local target=${1:-"dev"}

    if [ "$target" = "dev" ]; then
        local db_path="$DEV_DB_PATH"
    elif [ "$target" = "prod" ]; then
        local db_path="$PROD_DB_PATH"
    else
        log_error "Invalid target. Use 'dev' or 'prod'"
        exit 1
    fi

    # Check if database exists
    if [ ! -f "$db_path" ]; then
        log_warning "Database doesn't exist at $db_path. Creating new database."
        create_db "$target"
        return
    fi

    log_warning "This will backup and reset the $target database!"
    read -p "Continue? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Create backup first
        log_info "Creating backup before reset..."
        backup_db "$target"

        # Remove existing database
        if [ "$target" = "prod" ]; then
            sudo rm -f "$db_path"
        else
            rm -f "$db_path"
        fi

        # Create new database
        create_db "$target"
        log_success "Database reset completed"
    else
        log_info "Reset cancelled"
    fi
}

# Main script logic
case "${1:-}" in
    "status")
        show_status
        ;;
    "backup")
        backup_db "$2"
        ;;
    "restore")
        restore_db "$2"
        ;;
    "copy-to-prod")
        copy_to_prod
        ;;
    "copy-from-prod")
        copy_from_prod
        ;;
    "vacuum")
        vacuum_db "$2"
        ;;
    "schema")
        show_schema "$2"
        ;;
    "size")
        show_size "$2"
        ;;
    "init")
        init_dev
        ;;
    "create")
        create_db "$2"
        ;;
    "reset")
        reset_db "$2"
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        log_error "No command specified"
        echo ""
        show_help
        exit 1
        ;;
    *)
        log_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

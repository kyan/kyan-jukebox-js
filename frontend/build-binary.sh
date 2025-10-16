#!/bin/bash

# Build Binary Script for Kyan Jukebox Frontend
# This script creates a standalone executable that serves the React frontend

# Show usage if help requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Usage: $0 [BINARY_NAME]"
  echo ""
  echo "Builds a standalone executable for the Kyan Jukebox frontend."
  echo ""
  echo "Arguments:"
  echo "  BINARY_NAME    Name of the output binary (default: jukebox-frontend-bin)"
  echo ""
  echo "Examples:"
  echo "  $0                    # Creates 'jukebox-frontend-bin'"
  echo "  $0 my-jukebox         # Creates 'my-jukebox'"
  echo "  $0 jukebox-prod       # Creates 'jukebox-prod'"
  echo ""
  exit 0
fi

# Configuration
BINARY_NAME="${1:-jukebox-frontend-bin}"

set -e  # Exit on any error

echo "🎵 Building Kyan Jukebox Frontend Binary: $BINARY_NAME"

# Step 1: Clean any existing build artifacts
echo "📁 Cleaning previous builds..."
rm -rf dist/
rm -f "$BINARY_NAME"

# Step 2: Build the React frontend for browser
echo "⚛️  Building React frontend..."
bun build ./src/index.tsx \
  --outdir=dist \
  --sourcemap \
  --target=browser \
  --minify \
  --define:process.env.NODE_ENV='"production"' \
  --env='REACT_APP_*'

# Verify the required files were created
echo "✅ Verifying build artifacts..."
required_files=(
  "dist/index.js"
  "dist/index.css"
  "dist/index.js.map"
)

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ ERROR: Required file $file was not created"
    exit 1
  fi
  echo "   ✓ $file ($(du -h "$file" | cut -f1))"
done

# Check for any PNG assets (artwork files)
png_files=$(find dist/ -name "*.png" 2>/dev/null || true)
if [ -n "$png_files" ]; then
  echo "   ✓ Found PNG assets:"
  echo "$png_files" | while read -r file; do
    echo "     - $file ($(du -h "$file" | cut -f1))"
  done
fi

# Step 3: Build the standalone executable
echo "🔨 Building standalone executable..."
bun build --compile --minify --sourcemap ./server.tsx --outfile "$BINARY_NAME"

# Step 4: Verify the executable was created
if [ -f "$BINARY_NAME" ]; then
  file_size=$(du -h "$BINARY_NAME" | cut -f1)
  echo "✅ Binary created successfully: $BINARY_NAME ($file_size)"
  echo "🚀 Run with: ./$BINARY_NAME"
  echo "📱 Then open: http://localhost:3000"
else
  echo "❌ ERROR: Binary was not created"
  exit 1
fi

echo "🎉 Build complete!"

# Optional: Show what files are embedded
echo ""
echo "📦 Files embedded in binary:"
echo "   - server.tsx (HTTP server code)"
echo "   - dist/index.js (React app bundle)"
echo "   - dist/index.css (Styles)"
echo "   - dist/index.js.map (Source maps)"
if [ -n "$png_files" ]; then
  echo "$png_files" | while read -r file; do
    echo "   - $file (Assets)"
  done
fi

# Step 5: Clean up build artifacts since they're now embedded
echo ""
echo "🧹 Cleaning up build artifacts..."
rm -rf dist/
echo "   ✓ Removed dist/ folder (files are embedded in binary)"

echo ""
echo "ℹ️  The binary is completely self-contained and can be deployed anywhere!"

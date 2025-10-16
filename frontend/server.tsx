import { serve } from 'bun'
import { join } from 'path'

const PORT = 3000
const DIST_DIR = './dist'

// HTML template that loads our bundled JS and CSS
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kyan Jukebox</title>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"></link>
    <link rel="stylesheet" href="/index.css">
</head>
<body>
    <div id="root"></div>
    <script src="/index.js"></script>
</body>
</html>
`

// Helper function to get MIME type based on file extension
function getMimeType(filepath: string): string {
  const ext = filepath.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'js':
      return 'application/javascript'
    case 'css':
      return 'text/css'
    case 'map':
      return 'application/json'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'svg':
      return 'image/svg+xml'
    case 'ico':
      return 'image/x-icon'
    case 'woff':
      return 'font/woff'
    case 'woff2':
      return 'font/woff2'
    case 'ttf':
      return 'font/ttf'
    case 'eot':
      return 'application/vnd.ms-fontobject'
    default:
      return 'application/octet-stream'
  }
}

const server = serve({
  port: PORT,
  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true
  },
  async fetch(req) {
    const url = new URL(req.url)
    const pathname = url.pathname

    // Serve static files from dist directory
    const filePath = join(DIST_DIR, pathname.slice(1)) // Remove leading slash
    const file = Bun.file(filePath)

    if (await file.exists()) {
      return new Response(file, {
        headers: {
          'Content-Type': getMimeType(filePath),
          'Cache-Control': 'public, max-age=31536000'
        }
      })
    }

    // Fallback to index.html for client-side routing
    return new Response(htmlTemplate, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
})

console.log(`🎵 Kyan Jukebox running at http://localhost:${PORT}`)

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down server gracefully...')
  server.stop()
  process.exit(0)
}

// Listen for termination signals
process.on('SIGINT', gracefulShutdown) // Ctrl+C
process.on('SIGTERM', gracefulShutdown) // Terminate signal
process.on('SIGHUP', gracefulShutdown) // Hang up signal

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error)
  gracefulShutdown()
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown()
})

import { serve } from 'bun'
import indexHtml from './index.html'

const PORT = 3000

const server = serve({
  port: PORT,
  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true
  },
  routes: {
    '/': indexHtml
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

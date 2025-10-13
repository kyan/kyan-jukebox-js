import { serve } from 'bun'
import { readFileSync, existsSync, watch } from 'fs'
import { join } from 'path'

const PORT = process.env.PORT || 3000
const PUBLIC_DIR = './public'
const SRC_DIR = './src'

console.log('🚀 Starting Bun development server...')

// Simple HTML template with hot reload script
const getIndexHtml = () => {
  const template = readFileSync(join(PUBLIC_DIR, 'index.html'), 'utf-8')
  return template.replace(/%PUBLIC_URL%/g, '').replace(
    '</head>',
    `
    <script>
      // Simple hot reload client
      const ws = new WebSocket('ws://localhost:${PORT}/ws');
      ws.onmessage = (event) => {
        if (event.data === 'reload') {
          window.location.reload();
        }
      };
    </script>
    </head>`
  )
}

// Track connected WebSocket clients for hot reload
const clients: Set<WebSocket> = new Set()

const server = serve({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url)

    // Handle WebSocket connections for hot reload
    if (url.pathname === '/ws') {
      if (server.upgrade(req)) {
        return // WebSocket upgrade successful
      }
      return new Response('WebSocket upgrade failed', { status: 400 })
    }

    // Serve static files from public directory
    if (url.pathname.startsWith('/static/')) {
      const filePath = join(PUBLIC_DIR, url.pathname.slice(1))
      if (existsSync(filePath)) {
        return new Response(readFileSync(filePath))
      }
    }

    // Serve favicon and other root files
    const rootFiles = ['favicon.ico', 'manifest.json', 'jukebox.png']
    if (rootFiles.includes(url.pathname.slice(1))) {
      const filePath = join(PUBLIC_DIR, url.pathname.slice(1))
      if (existsSync(filePath)) {
        return new Response(readFileSync(filePath))
      }
    }

    // Handle React app bundle
    if (url.pathname === '/static/js/main.js') {
      try {
        const result = await Bun.build({
          entrypoints: ['./src/index-bun.tsx'],
          target: 'browser',
          format: 'esm',
          minify: false,
          sourcemap: 'linked',
          define: {
            'process.env.NODE_ENV': '"development"',
            'process.env.REACT_APP_WS_URL': `"${process.env.REACT_APP_WS_URL || 'localhost'}"`,
            'process.env.REACT_APP_WS_PORT': `"${process.env.REACT_APP_WS_PORT || '8080'}"`
          },
          loader: {
            '.css': 'css',
            '.png': 'dataurl',
            '.jpg': 'dataurl',
            '.jpeg': 'dataurl',
            '.gif': 'dataurl',
            '.svg': 'text',
            '.woff': 'dataurl',
            '.woff2': 'dataurl',
            '.ttf': 'dataurl',
            '.eot': 'dataurl'
          }
        })

        if (result.success && result.outputs.length > 0) {
          const jsContent = await result.outputs[0].text()
          return new Response(jsContent, {
            headers: { 'Content-Type': 'application/javascript' }
          })
        }
      } catch (error) {
        console.error('Build error:', error)
        return new Response(`console.error(${JSON.stringify(error.message)});`, {
          headers: { 'Content-Type': 'application/javascript' },
          status: 500
        })
      }
    }

    // Handle CSS bundle
    if (url.pathname === '/static/css/main.css') {
      // For now, return empty CSS as styles are inlined
      return new Response('/* Styles are inlined by Bun bundler */', {
        headers: { 'Content-Type': 'text/css' }
      })
    }

    // Serve index.html for all other routes (SPA routing)
    return new Response(getIndexHtml(), {
      headers: { 'Content-Type': 'text/html' }
    })
  },

  websocket: {
    open(ws) {
      clients.add(ws)
      console.log('🔌 Client connected for hot reload')
    },
    close(ws) {
      clients.delete(ws)
      console.log('🔌 Client disconnected')
    },
    message() {
      // Handle WebSocket messages if needed
    }
  }
})

// Watch for file changes and trigger hot reload
if (existsSync(SRC_DIR)) {
  watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (
      filename &&
      (filename.endsWith('.tsx') ||
        filename.endsWith('.ts') ||
        filename.endsWith('.scss') ||
        filename.endsWith('.css'))
    ) {
      console.log(`📝 File changed: ${filename}`)

      // Recompile SCSS if styles changed
      if (filename.endsWith('.scss')) {
        try {
          const { compile } = require('sass')
          const scssResult = compile('./src/styles/index.scss', {
            style: 'expanded',
            sourceMap: true
          })
          console.log('🎨 SCSS recompiled')
        } catch (error) {
          console.error('❌ SCSS compilation error:', error.message)
        }
      }

      // Notify all connected clients to reload
      clients.forEach(client => {
        try {
          client.send('reload')
        } catch (error) {
          // Client might be disconnected
          clients.delete(client)
        }
      })
    }
  })
}

console.log(`✅ Development server running at http://localhost:${PORT}`)
console.log(`🔄 Hot reload enabled - watching ${SRC_DIR} for changes`)
console.log('')
console.log('Note: This is a simple development server.')
console.log('For production builds, use: bun run build')

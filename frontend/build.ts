import { build } from 'bun'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { compile } from 'sass'

const isDev = process.env.NODE_ENV !== 'production'
const outdir = './build'

// Ensure build directory exists
if (!existsSync(outdir)) {
  mkdirSync(outdir, { recursive: true })
}

// Copy public files to build directory
const publicFiles = ['favicon.ico', 'manifest.json', 'jukebox.png']
const staticDir = join(outdir, 'static')
if (!existsSync(staticDir)) {
  mkdirSync(staticDir, { recursive: true })
}

publicFiles.forEach(file => {
  const srcPath = join('./public', file)
  const destPath = join(outdir, file)
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath)
  }
})

// Generate HTML file
const indexTemplate = readFileSync('./public/index.html', 'utf-8')
const outputHtml = indexTemplate
  .replace(/%PUBLIC_URL%/g, '')
  .replace('</head>', '  <link rel="stylesheet" href="./static/css/main.css">\n  </head>')
  .replace('</body>', '  <script src="./static/js/main.js"></script>\n  </body>')

// Compile SCSS to CSS
console.log('📦 Compiling SCSS...')
try {
  const scssResult = compile('./src/styles/index.scss', {
    style: isDev ? 'expanded' : 'compressed',
    sourceMap: isDev,
    loadPaths: ['./src/styles', './node_modules']
  })

  const cssDir = join(outdir, 'static', 'css')
  if (!existsSync(cssDir)) {
    mkdirSync(cssDir, { recursive: true })
  }

  writeFileSync(join(cssDir, 'main.css'), scssResult.css)
  if (isDev && scssResult.sourceMap) {
    writeFileSync(join(cssDir, 'main.css.map'), JSON.stringify(scssResult.sourceMap))
  }
  console.log('✅ SCSS compiled successfully')
} catch (error) {
  console.warn('⚠️ SCSS compilation failed, using empty CSS:', error.message)
  const cssDir = join(outdir, 'static', 'css')
  if (!existsSync(cssDir)) {
    mkdirSync(cssDir, { recursive: true })
  }
  writeFileSync(join(cssDir, 'main.css'), '/* SCSS compilation failed */')
}

writeFileSync(join(outdir, 'index.html'), outputHtml)

console.log('Building React app with Bun...')

try {
  const result = await build({
    entrypoints: ['./src/index-bun.tsx'],
    outdir: join(outdir, 'static', 'js'),
    target: 'browser',
    format: 'esm',
    splitting: true,
    minify: !isDev,
    sourcemap: isDev ? 'linked' : false,
    treeshaking: true,
    loader: {
      '.css': 'css',
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.svg': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file'
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_APP_WS_URL': JSON.stringify(process.env.REACT_APP_WS_URL || 'localhost'),
      'process.env.REACT_APP_WS_PORT': JSON.stringify(process.env.REACT_APP_WS_PORT || '8080')
    },
    external: [],
    naming: {
      entry: 'main.[hash]',
      chunk: '[name].[hash]',
      asset: '[name].[hash]'
    },
    plugins: [],
    drop: isDev ? [] : ['console', 'debugger']
  })

  console.log('✅ Build completed successfully!')

  if (result.outputs && result.outputs.length > 0) {
    console.log('\nOutput files:')
    result.outputs.forEach(output => {
      const relativePath = output.path.replace(process.cwd() + '/', '')
      console.log(`  ${relativePath} (${(output.size / 1024).toFixed(2)} KB)`)
    })
  }

  console.log('\n🎉 Frontend build complete!')
  console.log(`📁 Output directory: ${outdir}`)
  console.log('🚀 Ready for deployment!')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}

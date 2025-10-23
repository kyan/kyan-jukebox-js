import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Note: SCSS is compiled separately in the build process

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)

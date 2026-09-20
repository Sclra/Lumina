import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const standaloneNavigator = navigator as Navigator & { standalone?: boolean }
const isInstalled =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  standaloneNavigator.standalone === true

document.documentElement.classList.toggle('installed-app', isInstalled)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error)
    })
  })
}

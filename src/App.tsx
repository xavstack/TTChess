import type { JSX } from 'react'
import { useEffect } from 'react'
import AppShell from './components/Layout/AppShell'
import ChessBoard from './components/Board/ChessBoard'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

function App(): JSX.Element {
  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('ttc_theme_v1')
    const savedHighContrast = localStorage.getItem('ttc_high_contrast_v1')

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }

    if (savedHighContrast === 'true') {
      document.documentElement.classList.add('high-contrast')
    }
  }, [])

  return (
    <ErrorBoundary>
      <AppShell>
        <ChessBoard />
      </AppShell>
    </ErrorBoundary>
  )
}

export default App

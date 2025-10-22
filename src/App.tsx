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
    const savedBoardTheme = localStorage.getItem('ttc_board_theme_v1')

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }

    if (savedHighContrast === 'true') {
      document.documentElement.classList.add('high-contrast')
    }

    if (savedBoardTheme) {
      document.documentElement.classList.add(`board-${savedBoardTheme}`)
    } else {
      document.documentElement.classList.add('board-classic-green')
    }
  }, [])

  const playerNames = {
    white: 'You',
    black: 'AI'
  }

  return (
    <ErrorBoundary>
      <AppShell>
        <ChessBoard playerNames={playerNames} />
      </AppShell>
    </ErrorBoundary>
  )
}

export default App

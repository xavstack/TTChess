import type { JSX } from 'react'
import { useEffect, useState } from 'react'
import AppShell from './components/Layout/AppShell'
import ChessBoard from './components/Board/ChessBoard'
import GameEndModal from './components/Layout/GameEndModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useGameStore } from './store/gameStore'
import './index.css'

function App(): JSX.Element {
  const [isGameEndModalOpen, setIsGameEndModalOpen] = useState(false)
  const { chess, boardVersion } = useGameStore()

  // Check for game over state
  useEffect(() => {
    if (chess.isGameOver() && !isGameEndModalOpen) {
      // Delay modal to allow last move to be visible
      setTimeout(() => {
        setIsGameEndModalOpen(true)
      }, 800)
    }
  }, [chess, boardVersion, isGameEndModalOpen])

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
      <GameEndModal 
        isOpen={isGameEndModalOpen} 
        onClose={() => setIsGameEndModalOpen(false)} 
      />
    </ErrorBoundary>
  )
}

export default App

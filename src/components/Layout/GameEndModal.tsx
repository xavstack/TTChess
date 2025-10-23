import type { JSX } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

interface GameEndModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GameEndModal({ isOpen, onClose }: GameEndModalProps): JSX.Element {
  const { chess, exportPgn } = useGameStore()

  if (!isOpen) return <></>

  const isCheckmate = chess.isCheckmate()
  const isStalemate = chess.isStalemate()
  const isDraw = chess.isDraw()
  const isInsufficientMaterial = chess.isInsufficientMaterial()
  const isThreefoldRepetition = chess.isThreefoldRepetition()
  
  const winner = isCheckmate ? (chess.turn() === 'w' ? 'Black' : 'White') : null
  const moveCount = chess.history().length
  
  let title = 'Game Over'
  let subtitle = ''
  
  if (isCheckmate) {
    title = `Checkmate! ${winner} Wins!`
    subtitle = `Victory by checkmate in ${Math.ceil(moveCount / 2)} moves`
  } else if (isStalemate) {
    title = 'Stalemate!'
    subtitle = 'Game drawn - no legal moves available'
  } else if (isInsufficientMaterial) {
    title = 'Draw'
    subtitle = 'Insufficient material to checkmate'
  } else if (isThreefoldRepetition) {
    title = 'Draw'
    subtitle = 'Threefold repetition'
  } else if (isDraw) {
    title = 'Draw'
    subtitle = 'Game ended in a draw'
  }

  const handleNewGame = () => {
    useGameStore.getState().chess.reset()
    useGameStore.setState({
      boardVersion: Math.random(),
      selected: null,
      legalTargets: [],
      activeSide: null,
      timeWhiteMs: 5 * 60 * 1000,
      timeBlackMs: 5 * 60 * 1000,
    })
    onClose()
  }

  const handleExportPGN = () => {
    const pgn = exportPgn()
    const blob = new Blob([pgn], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `game-${Date.now()}.pgn`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 p-8 max-w-md w-full mx-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-end-title"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2
                id="game-end-title"
                className="text-3xl font-bold mb-2 text-gray-900 dark:text-white"
              >
                {title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.ceil(moveCount / 2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {winner || 'Draw'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Result</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleNewGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                New Game
              </button>
              <button
                onClick={handleExportPGN}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Export PGN
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Review Game
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


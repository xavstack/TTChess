import type { JSX } from 'react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { Chess } from 'chess.js'

interface MoveListProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function MoveList({ isCollapsed = false, onToggle }: MoveListProps): JSX.Element {
  const { chess, boardVersion } = useGameStore()
  const [jumpToMove, setJumpToMove] = useState<number | null>(null)

  const moves = useMemo(() => {
    const history = chess.history({ verbose: true })
    const pairs: Array<{ white: string; black?: string; moveNumber: number }> = []
    
    for (let i = 0; i < history.length; i += 2) {
      const white = history[i]?.san || ''
      const black = history[i + 1]?.san || ''
      pairs.push({
        white,
        black: black || undefined,
        moveNumber: Math.floor(i / 2) + 1
      })
    }
    
    return pairs
  }, [chess, boardVersion])

  const handleJumpToMove = (moveNumber: number) => {
    setJumpToMove(moveNumber)
    // Reset board to that position
    const history = chess.history({ verbose: true })
    const targetIndex = (moveNumber - 1) * 2
    
    // Reset and replay moves up to target
    const tempChess = new Chess()
    tempChess.reset()
    for (let i = 0; i < targetIndex && i < history.length; i++) {
      tempChess.move(history[i])
    }
    
    // Update store with the position
    useGameStore.setState({ 
      chess: tempChess, 
      boardVersion: Math.random(),
      selected: null,
      legalTargets: []
    })
    setJumpToMove(null)
  }

  const copyMoves = () => {
    const pgn = chess.pgn()
    navigator.clipboard.writeText(pgn)
  }

  const exportMoves = () => {
    const pgn = chess.pgn()
    const blob = new Blob([pgn], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'moves.pgn'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white/60 dark:bg-black/40 rounded-md border overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm md:text-base">Move List</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyMoves}
            className="text-xs bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2 py-1 rounded"
            title="Copy moves"
          >
            📋
          </button>
          <button
            onClick={exportMoves}
            className="text-xs bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 px-2 py-1 rounded"
            title="Export moves"
          >
            💾
          </button>
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto p-3">
              {moves.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                  No moves yet
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1 text-xs md:text-sm">
                  {moves.map(({ white, black, moveNumber }) => (
                    <div key={moveNumber} className="contents">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-1 rounded">
                        <span className="font-medium">{moveNumber}.</span>
                        <button
                          onClick={() => handleJumpToMove(moveNumber)}
                          className="hover:bg-gray-200 dark:hover:bg-gray-700 px-1 rounded flex-1 text-left"
                          disabled={jumpToMove === moveNumber}
                        >
                          {white}
                        </button>
                      </div>
                      {black && (
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-1 rounded">
                          <span className="w-6"></span>
                          <button
                            onClick={() => handleJumpToMove(moveNumber)}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 px-1 rounded flex-1 text-left"
                            disabled={jumpToMove === moveNumber}
                          >
                            {black}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

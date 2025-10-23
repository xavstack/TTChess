import type { JSX } from 'react'
import { useMemo } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getPieceUnicode } from '../../utils/pieceSets'
import { motion, AnimatePresence } from 'framer-motion'
import type { Square } from 'chess.js'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

function squareName(fileIdx: number, rankIdx: number): Square {
  return `${files[fileIdx]}${ranks[rankIdx]}` as Square
}

function isDark(fileIdx: number, rankIdx: number): boolean {
  return (fileIdx + rankIdx) % 2 === 1
}

interface ChessBoardProps {
  playerNames?: {
    white: string
    black: string
  }
}

export function ChessBoard({ playerNames }: ChessBoardProps): JSX.Element {
  const { chess, selected, legalTargets, selectSquare, makeMove, boardVersion, flipped, showCoordinates, showAids, aids, pieceSet } =
    useGameStore()

  const board = useMemo(() => chess.board(), [chess, boardVersion])

  return (
    <div className="board-container">
      {/* Player nameplate - Black (top) */}
      {playerNames && (
        <div className="player-nameplate mb-2">
          {flipped ? playerNames.white : playerNames.black}
        </div>
      )}

      {/* Chess board with coordinates */}
      <div className="board-viewport relative">
        {/* File coordinates (bottom) */}
        {showCoordinates && (
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1 text-xs font-medium text-gray-600 dark:text-gray-400">
            {files.map((file, idx) => (
              <span key={file} className="w-8 text-center">
                {flipped ? files[7 - idx] : file}
              </span>
            ))}
          </div>
        )}

        {/* Rank coordinates (left) */}
        {showCoordinates && (
          <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
            {ranks.map((rank, idx) => (
              <span key={rank} className="h-8 flex items-center justify-center">
                {flipped ? ranks[7 - idx] : rank}
              </span>
            ))}
          </div>
        )}

        <svg viewBox="0 0 8 8" className="w-full h-full">
          {Array.from({ length: 8 }).map((_, rankIdx) =>
            Array.from({ length: 8 }).map((_, fileIdx) => {
              const uiFileIdx = flipped ? 7 - fileIdx : fileIdx
              const uiRankIdx = flipped ? 7 - rankIdx : rankIdx
              const sq = squareName(uiFileIdx, uiRankIdx)
              const cell = board[uiRankIdx][uiFileIdx]
              const piece = cell
                ? getPieceUnicode((cell.color === 'w' ? cell.type.toUpperCase() : cell.type) as string, pieceSet)
                : ''
              const isSel = selected === sq
              const isTarget = legalTargets.includes(sq)
              return (
                <g
                  key={`${fileIdx}-${rankIdx}`}
                  onClick={() => {
                    if (selected) {
                      if (isTarget) {
                        makeMove(selected, sq)
                      } else if (selected === sq) {
                        selectSquare(null)
                      } else {
                        selectSquare(sq)
                      }
                    } else {
                      selectSquare(sq)
                    }
                  }}
                >
                  <rect
                    x={fileIdx}
                    y={rankIdx}
                    width={1}
                    height={1}
                    className={
                      isSel
                        ? 'fill-accent'
                        : isDark(fileIdx, rankIdx)
                          ? 'fill-board-dark'
                          : 'fill-board-light'
                    }
                  />
                  {isTarget && (
                    <circle
                      cx={fileIdx + 0.5}
                      cy={rankIdx + 0.5}
                      r={0.12}
                      className="fill-black/40"
                    />
                  )}
                  <AnimatePresence>
                    {piece && (
                      <motion.text
                        key={`${sq}-${piece}`}
                        x={fileIdx + 0.5}
                        y={rankIdx + 0.68}
                        textAnchor="middle"
                        className="select-none"
                        fontSize={0.8}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {piece}
                      </motion.text>
                    )}
                  </AnimatePresence>
                </g>
              )
            })
          )}

          {/* Overlays must render LAST so they appear above pieces */}
          {/* Check highlight */}
          {chess.inCheck() && (() => {
            // Find king square of the side to move
            const turn = chess.turn()
            let kingFile = -1
            let kingRank = -1
            const grid = chess.board()
            for (let r = 0; r < 8; r++) {
              for (let f = 0; f < 8; f++) {
                const cell = grid[r][f]
                if (cell && cell.type === 'k' && cell.color === turn) {
                  kingFile = f
                  kingRank = r
                }
              }
            }
            if (kingFile >= 0) {
              const uiFile = flipped ? 7 - kingFile : kingFile
              const uiRank = flipped ? 7 - kingRank : kingRank
              return (
                <rect
                  x={uiFile}
                  y={uiRank}
                  width={1}
                  height={1}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.15"
                />
              )
            }
            return null
          })()}

          {/* Gameplay aids overlays */}
          {showAids && (
            <>
              {/* Best move arrow */}
              {aids.bestMove && (
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
                  </marker>
                </defs>
              )}
              {aids.bestMove && (
                <line
                  x1={files.indexOf(aids.bestMove.from[0] as any) + 0.5}
                  y1={ranks.indexOf(aids.bestMove.from[1] as any) + 0.5}
                  x2={files.indexOf(aids.bestMove.to[0] as any) + 0.5}
                  y2={ranks.indexOf(aids.bestMove.to[1] as any) + 0.5}
                  stroke="#22d3ee"
                  strokeWidth="0.1"
                  markerEnd="url(#arrowhead)"
                />
              )}
              {/* Capture circles */}
              {aids.captures.map((capture, idx) => (
                <circle
                  key={idx}
                  cx={files.indexOf(capture.to[0] as any) + 0.5}
                  cy={ranks.indexOf(capture.to[1] as any) + 0.5}
                  r="0.3"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.08"
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Player nameplate - White (bottom) */}
      {playerNames && (
        <div className="player-nameplate mt-2">
          {flipped ? playerNames.black : playerNames.white}
        </div>
      )}
    </div>
  )
}

export default ChessBoard

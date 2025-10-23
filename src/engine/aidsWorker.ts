/// <reference lib="webworker" />

import { Chess } from 'chess.js'
import type { Square } from 'chess.js'

export interface AidsRequest {
  type: 'analyze'
  fen: string
}

export interface AidsResponse {
  type: 'analysis'
  bestMove?: {
    from: Square
    to: Square
    san: string
  }
  captures: Array<{
    from: Square
    to: Square
    piece: string
  }>
}

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

ctx.onmessage = (e: MessageEvent<AidsRequest>) => {
  const msg = e.data
  
  if (msg.type === 'analyze') {
    try {
      const chess = new Chess(msg.fen)
      
      // Find best move (improved heuristic)
      const moves = chess.moves({ verbose: true })
      let bestMove: { from: Square; to: Square; san: string } | undefined
      
      if (moves.length > 0) {
        // Simple evaluation: prioritize captures, checks, center control
        const scoredMoves = moves.map(move => {
          let score = 0
          
          // Captures
          if (move.captured) {
            const pieceValues: Record<string, number> = {
              'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
            }
            score += pieceValues[move.captured] || 0
          }
          
          // Checks
          if (move.san.includes('+')) {
            score += 2
          }
          
          // Center control
          const centerFiles = ['d', 'e']
          const centerRanks = ['4', '5']
          if (centerFiles.includes(move.to[0]) && centerRanks.includes(move.to[1])) {
            score += 1
          }

          // Development bonus: move minor pieces off back rank
          const backRank = ['1', '8']
          if ((move.piece === 'n' || move.piece === 'b') && backRank.includes(move.from[1])) {
            score += 0.5
          }

          // King safety: penalize early king moves
          if (move.piece === 'k' && !move.san.includes('O-O')) {
            score -= 0.5
          }
          
          return { move, score }
        })
        
        const best = scoredMoves.reduce((a, b) => a.score > b.score ? a : b)
        bestMove = {
          from: best.move.from as Square,
          to: best.move.to as Square,
          san: best.move.san
        }
      }
      
      // Find all capture moves
      const captures = moves
        .filter(move => move.captured)
        .map(move => ({
          from: move.from as Square,
          to: move.to as Square,
          piece: move.piece
        }))
      
      const response: AidsResponse = {
        type: 'analysis',
        bestMove,
        captures
      }
      
      ctx.postMessage(response)
    } catch (error) {
      console.error('Analysis worker error:', error)
      ctx.postMessage({
        type: 'analysis',
        bestMove: undefined,
        captures: []
      } satisfies AidsResponse)
    }
  }
}

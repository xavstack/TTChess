/// <reference lib="webworker" />
import { Chess } from 'chess.js'
import type { EngineRequest, EngineResponse } from './types'

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

let skill = 5
let movetime = 300

// Simple evaluation function for move selection
function evaluateMove(chess: Chess, move: any, skill: number): number {
  let score = Math.random() * (21 - skill) // Add randomness based on skill

  // Piece values
  const pieceValues: Record<string, number> = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
  }

  // Favor captures
  if (move.captured) {
    score += pieceValues[move.captured] * (skill / 4)
  }

  // Favor checks
  if (move.san.includes('+')) {
    score += 3 * (skill / 10)
  }

  // Favor checkmates
  if (move.san.includes('#')) {
    score += 1000
  }

  // Favor center control (more important at higher skills)
  const centerSquares = ['d4', 'd5', 'e4', 'e5']
  if (centerSquares.includes(move.to) && skill > 5) {
    score += 2 * (skill / 10)
  }

  // Favor development (more important at higher skills)
  const backRank = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
  if (backRank.includes(move.from) && skill > 8) {
    score += 1.5 * (skill / 10)
  }

  // Higher skill: avoid hanging pieces
  if (skill > 10) {
    // Simple check: if moving to a square attacked by lower value piece
    const testChess = new Chess(chess.fen())
    testChess.move(move)
    if (testChess.isCheck() && testChess.turn() === chess.turn()) {
      score -= 5 // Penalize moves that leave king in check (illegal anyway, but safety)
    }
  }

  return score
}

ctx.onmessage = (e: MessageEvent<EngineRequest>) => {
  const msg = e.data

  if (msg.type === 'init') {
    skill = msg.skill
    movetime = msg.movetime
    // Note: depth and chess960 from msg available but not used in current implementation
    ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
    return
  }

  if (msg.type === 'newgame') {
    ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
    return
  }

  if (msg.type === 'bestmove') {
    try {
      const chess = new Chess(msg.fen)
      const moves = chess.moves({ verbose: true })

      if (moves.length === 0) {
        throw new Error('No legal moves available')
      }

      // Evaluate all moves
      const scoredMoves = moves.map(move => ({
        move,
        score: evaluateMove(chess, move, skill)
      }))

      // Sort by score and pick based on skill
      scoredMoves.sort((a, b) => b.score - a.score)

      // Higher skill = more likely to pick best move
      const randomness = Math.max(0, 20 - skill) // 0-19 range
      const pickIndex = Math.floor(Math.random() * Math.min(randomness + 1, scoredMoves.length))
      const selectedMove = scoredMoves[pickIndex].move

      // Simulate thinking time based on difficulty
      const thinkTime = movetime + (skill * 20) // Higher skill thinks longer
      
      setTimeout(() => {
        ctx.postMessage({
          type: 'bestmove',
          san: selectedMove.san,
          from: selectedMove.from,
          to: selectedMove.to,
        } satisfies EngineResponse)
      }, thinkTime)

    } catch (error) {
      console.error('Engine worker error:', error)
      // Send a random move as ultimate fallback
      const chess = new Chess(msg.fen)
      const moves = chess.moves({ verbose: true })
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)]
        ctx.postMessage({
          type: 'bestmove',
          san: randomMove.san,
          from: randomMove.from,
          to: randomMove.to,
        } satisfies EngineResponse)
      }
    }
  }
}

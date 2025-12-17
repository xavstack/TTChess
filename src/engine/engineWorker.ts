/// <reference lib="webworker" />
import { Chess } from 'chess.js'
import type { EngineRequest, EngineResponse } from './types'

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

let skill = 5
let depth = 6
let movetime = 300
let readySent = false

type VerboseMove = ReturnType<Chess['moves']>[number]

const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
}

function evaluatePosition(chess: Chess): number {
  const board = chess.board()
  let score = 0

  for (const row of board) {
    for (const square of row) {
      if (!square) continue
      const value = pieceValues[square.type] ?? 0
      score += square.color === 'w' ? value : -value
    }
  }

  // Mobility
  const moves = chess.moves()
  score += (moves.length * 5) * (chess.turn() === 'w' ? 1 : -1)

  if (chess.isCheck()) {
    score += chess.turn() === 'w' ? -30 : 30
  }

  return score
}

function negamax(chess: Chess, depthLeft: number, alpha: number, beta: number, deadline: number): number {
  if (Date.now() > deadline) return evaluatePosition(chess)
  if (depthLeft === 0 || chess.isGameOver()) return evaluatePosition(chess)

  let best = -Infinity
  const moves = chess.moves({ verbose: true })
  for (const move of moves) {
    chess.move(move)
    const score = -negamax(chess, depthLeft - 1, -beta, -alpha, deadline)
    chess.undo()
    if (score > best) best = score
    if (score > alpha) alpha = score
    if (alpha >= beta) break
  }
  return best
}

function evaluateMove(chess: Chess, move: VerboseMove, s: number, searchDepth: number, deadline: number): number {
  let score = 0

  const captureValue = move.captured ? pieceValues[move.captured] ?? 0 : 0
  score += captureValue * (0.6 + s / 40)
  if (move.san.includes('+')) score += 50
  if (move.san.includes('#')) score += 5000

  const centerSquares = ['d4', 'd5', 'e4', 'e5']
  if (centerSquares.includes(move.to)) score += 10

  const backRank = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
  if (backRank.includes(move.from)) score += 5

  if (searchDepth > 1) {
    const testChess = new Chess(chess.fen())
    testChess.move(move)
    const lookahead = -negamax(testChess, searchDepth - 1, -Infinity, Infinity, deadline)
    score += lookahead * 0.8
  }

  // Reduce noise dramatically at higher skill levels
  // Beginner: up to 50 noise, Casual: up to 30, Challenging: up to 15, Hard: up to 5, Insane: up to 1
  const noise = Math.random() * Math.max(0, Math.min(50, 60 - s * 3))
  return score + noise
}

function sendReadyOnce() {
  if (readySent) return
  readySent = true
  ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
}

function handleSetOptions(message: Extract<EngineRequest, { type: 'setoptions' }>) {
  if (typeof message.skill === 'number') {
    skill = message.skill
  }
  if (typeof message.depth === 'number') {
    depth = message.depth
  }
  if (typeof message.movetime === 'number') {
    movetime = message.movetime
  }
}

function handleNewGame() {
  // Reset internal state (no-op for heuristic engine but keeps parity with contract)
}

function selectMove(chess: Chess): VerboseMove | null {
  const moves = chess.moves({ verbose: true })
  if (moves.length === 0) return null

  const deadline = Date.now() + Math.max(100, Math.min(movetime, 2000))
  // Scale search depth more aggressively: Beginner=1, Casual=2, Challenging=3, Hard=4, Insane=5-6
  const searchDepth = Math.max(
    1,
    Math.min(6, Math.floor(skill / 4) + Math.floor(depth / 3))
  )

  const scoredMoves = moves
    .map(move => ({ move, score: evaluateMove(chess, move, skill, searchDepth, deadline) }))
    .sort((a, b) => b.score - a.score)

  // Reduce randomness significantly at higher skill levels
  // Beginner: pick from top 5, Casual: top 3, Challenging: top 2, Hard: top 2, Insane: always best
  const randomnessFactor = Math.max(1, Math.floor((21 - skill) / 4))
  const topSlice = Math.min(scoredMoves.length, randomnessFactor)
  const candidates = scoredMoves.slice(0, topSlice)
  const pick = candidates[Math.floor(Math.random() * candidates.length)] ?? scoredMoves[0]
  return pick?.move ?? null
}

function handleBestMove(message: Extract<EngineRequest, { type: 'bestmove' }>) {
  let chess: Chess
  try {
    chess = new Chess(message.fen)
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      code: 'INVALID_FEN',
      message: error instanceof Error ? error.message : 'Invalid FEN',
    } satisfies EngineResponse)
    return
  }

  const move = selectMove(chess)
  if (!move) {
    ctx.postMessage({
      type: 'error',
      code: 'NO_MOVE',
      message: 'No legal move',
    } satisfies EngineResponse)
    return
  }

  const thinkTime = Math.max(0, Math.min(movetime, 2000)) + Math.floor(depth * 5)
  if (thinkTime > 0) {
    setTimeout(() => {
      ctx.postMessage(
        {
          type: 'bestmove',
          san: move.san,
          from: move.from,
          to: move.to,
        } satisfies EngineResponse
      )
    }, thinkTime)
  } else {
    ctx.postMessage(
      {
        type: 'bestmove',
        san: move.san,
        from: move.from,
        to: move.to,
      } satisfies EngineResponse
    )
  }
}

ctx.onmessage = (e: MessageEvent<EngineRequest>) => {
  const message = e.data
  if (!message || typeof message !== 'object') return

  switch (message.type) {
    case 'setoptions':
      handleSetOptions(message)
      return
    case 'newgame':
      handleNewGame()
      return
    case 'bestmove':
      handleBestMove(message)
      return
  }
}

sendReadyOnce()

/// <reference lib="webworker" />
import { Chess } from 'chess.js'
import type { EngineRequest, EngineResponse } from './types'

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

let skill = 5
let depth = 6
let movetime = 300
let currentPosition = new Chess()
let readySent = false

type VerboseMove = ReturnType<Chess['moves']>[number]

// Simple evaluation function for move selection
function evaluateMove(chess: Chess, move: VerboseMove, s: number): number {
  let score = Math.random() * Math.max(1, 21 - s) // Add randomness based on skill (higher skill = less noise)

  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  }

  if (move.captured) {
    score += (pieceValues[move.captured] ?? 0) * (s / 4)
  }

  if (move.san.includes('+')) {
    score += 3 * (s / 10)
  }

  if (move.san.includes('#')) {
    score += 1000
  }

  const centerSquares = ['d4', 'd5', 'e4', 'e5']
  if (centerSquares.includes(move.to) && s > 5) {
    score += 2 * (s / 10)
  }

  const backRank = [
    'a1',
    'b1',
    'c1',
    'd1',
    'e1',
    'f1',
    'g1',
    'h1',
    'a8',
    'b8',
    'c8',
    'd8',
    'e8',
    'f8',
    'g8',
    'h8',
  ]
  if (backRank.includes(move.from) && s > 8) {
    score += 1.5 * (s / 10)
  }

  if (s > 10) {
    const testChess = new Chess(chess.fen())
    testChess.move(move)
    if (testChess.isCheck() && testChess.turn() === chess.turn()) {
      score -= 5
    }
  }

  return score
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
  currentPosition = new Chess()
}

function selectMove(chess: Chess): VerboseMove | null {
  const moves = chess.moves({ verbose: true })
  if (moves.length === 0) return null

  const scoredMoves = moves
    .map(move => ({ move, score: evaluateMove(chess, move, skill) }))
    .sort((a, b) => b.score - a.score)

  const randomness = Math.max(0, 20 - skill)
  const pickIndex = Math.min(
    scoredMoves.length - 1,
    Math.floor(Math.random() * (randomness + 1))
  )
  return scoredMoves[pickIndex]?.move ?? null
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

  currentPosition = chess

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

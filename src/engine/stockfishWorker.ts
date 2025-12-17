/// <reference lib="webworker" />
import { Chess } from 'chess.js'
import type { EngineRequest, EngineResponse } from './types'

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope

type PendingRequest = {
  fen: string
  movetime?: number
  depth?: number
}

let stockfish: Worker | null = null
let ready = false
let pending: PendingRequest | null = null
let skill = 5
let depth = 6
let movetime = 300

function postReadyOnce() {
  if (ready) return
  ready = true
  ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
}

function postInitError(message: string) {
  ctx.postMessage({ type: 'error', code: 'INIT_FAILED', message } satisfies EngineResponse)
}

function ensureEngine(): boolean {
  if (stockfish) return true
  try {
    // Expect a wasm build that exposes Stockfish()/stockfish() factory
    importScripts('/stockfish.wasm.js')
    const factory = (self as unknown as { Stockfish?: () => Worker; stockfish?: () => Worker }).Stockfish
      ?? (self as unknown as { Stockfish?: () => Worker; stockfish?: () => Worker }).stockfish
    if (!factory) {
      postInitError('Stockfish factory not found in stockfish.wasm.js')
      return false
    }
    stockfish = factory()
  } catch (error) {
    postInitError(error instanceof Error ? error.message : 'Failed to load Stockfish wasm')
    return false
  }

  stockfish.onmessage = event => {
    const text = typeof event === 'string' ? event : event?.data
    if (typeof text !== 'string') return

    if (text.includes('uciok')) {
      stockfish?.postMessage('isready')
      return
    }

    if (text.includes('readyok')) {
      postReadyOnce()
      return
    }

    if (text.startsWith('bestmove')) {
      handleBestmoveLine(text)
    }
  }

  // Kick off UCI handshake
  stockfish.postMessage('uci')
  return true
}

function handleBestmoveLine(line: string) {
  if (!pending) return
  const match = line.match(/bestmove\s+([a-h][1-8])([a-h][1-8])/)
  if (!match) {
    ctx.postMessage({ type: 'error', code: 'NO_MOVE', message: 'No legal move' } satisfies EngineResponse)
    pending = null
    return
  }

  const [, from, to] = match
  let san = ''
  try {
    const chess = new Chess(pending.fen)
    const move = chess.move({ from, to, promotion: 'q' })
    san = move?.san ?? ''
  } catch {
    san = ''
  }

  ctx.postMessage({ type: 'bestmove', from, to, san } satisfies EngineResponse)
  pending = null
}

function applyOptions() {
  if (!stockfish) return
  stockfish.postMessage(`setoption name Skill Level value ${skill}`)
  // Keep hash small for browser environments
  stockfish.postMessage('setoption name Hash value 16')
  // Limit threads to 1 for compatibility
  stockfish.postMessage('setoption name Threads value 1')
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
  applyOptions()
}

function handleNewGame() {
  if (!stockfish) return
  stockfish.postMessage('ucinewgame')
}

function handleBestMove(message: Extract<EngineRequest, { type: 'bestmove' }>) {
  if (!ensureEngine()) return
  if (!ready) {
    postInitError('Stockfish not ready')
    return
  }

  pending = { fen: message.fen, movetime, depth }
  stockfish!.postMessage(`position fen ${message.fen}`)
  const goParts: string[] = ['go']
  if (movetime > 0) {
    goParts.push(`movetime ${Math.max(10, Math.min(movetime, 5000))}`)
  } else if (depth > 0) {
    goParts.push(`depth ${Math.max(1, depth)}`)
  }
  stockfish!.postMessage(goParts.join(' '))
}

ctx.onmessage = (event: MessageEvent<EngineRequest>) => {
  const message = event.data
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

// Attempt eager load to surface INIT errors early
ensureEngine()

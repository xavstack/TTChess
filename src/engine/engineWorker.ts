/// <reference lib="webworker" />
import { Chess } from 'chess.js'
import type { EngineRequest, EngineResponse } from './types'

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope
let skill = 1
let depth = 4
let movetime = 300
let chess960 = false

ctx.onmessage = (e: MessageEvent<EngineRequest>) => {
  const msg = e.data
  if (msg.type === 'init') {
    skill = msg.skill
    depth = msg.depth
    movetime = msg.movetime
    chess960 = !!msg.chess960
    ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
    return
  }
  if (msg.type === 'newgame') {
    // Placeholder for real UCI 'ucinewgame' reset when Stockfish is wired
    ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
    return
  }
  if (msg.type === 'bestmove') {
    const chess = new Chess(msg.fen)
    const moves = chess.moves({ verbose: true })
    // Very rough biasing to emulate difficulty; prefer center and captures
    const bias = (skill + depth + (chess960 ? 3 : 0)) % (moves.length || 1)
    const pick = moves[(Math.floor(Math.random() * moves.length) + bias) % moves.length]
    if (!pick) return
    setTimeout(() => {
      chess.move(pick)
      ctx.postMessage({
        type: 'bestmove',
        san: pick.san,
        from: pick.from,
        to: pick.to,
      } satisfies EngineResponse)
    }, movetime)
  }
}

/// <reference lib="webworker" />
import { Chess } from 'chess.js'
import type { EngineRequest, EngineResponse } from './types'

const ctx: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope
let skill = 1
let depth = 4
let movetime = 200

ctx.onmessage = (e: MessageEvent<EngineRequest>) => {
  const msg = e.data
  if (msg.type === 'init') {
    skill = msg.skill
    depth = msg.depth
    movetime = msg.movetime
    ctx.postMessage({ type: 'ready' } satisfies EngineResponse)
    return
  }
  if (msg.type === 'bestmove') {
    const chess = new Chess(msg.fen)
    const moves = chess.moves({ verbose: true })
    const bias = (skill + depth) % (moves.length || 1)
    const pick = moves[(Math.floor(Math.random() * moves.length) + bias) % moves.length]
    if (!pick) return
    setTimeout(
      () => {
        chess.move(pick)
        ctx.postMessage({
          type: 'bestmove',
          san: pick.san,
          from: pick.from,
          to: pick.to,
        } satisfies EngineResponse)
      },
      Math.max(50, movetime)
    )
  }
}

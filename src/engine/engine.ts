import EngineWorker from './engineWorker.ts?worker'
import { Chess } from 'chess.js'
import type {
  Difficulty,
  EnginePreset,
  BestMoveResult,
  EngineRequest,
  EngineResponse,
} from './types'

export type { Difficulty, BestMoveResult }

export const PRESETS: Record<Difficulty, EnginePreset> = {
  Beginner: { skill: 1, depth: 2, movetime: 150 },
  Casual: { skill: 5, depth: 6, movetime: 300 },
  Challenging: { skill: 10, depth: 10, movetime: 500 },
  Hard: { skill: 15, depth: 14, movetime: 800 },
  Insane: { skill: 20, depth: 18, movetime: 1200 },
}

export class Engine {
  private worker: Worker | null
  private ready: Promise<void>

  constructor(preset: Difficulty) {
    const { skill, depth, movetime } = PRESETS[preset]
    if (typeof Worker !== 'undefined') {
      this.worker = new (EngineWorker as unknown as new () => Worker)()
      this.ready = new Promise(resolve => {
        this.worker!.onmessage = () => resolve()
        const msg: EngineRequest = { type: 'init', skill, depth, movetime }
        this.worker!.postMessage(msg)
      })
    } else {
      this.worker = null
      this.ready = Promise.resolve()
    }
  }

  async bestMove(fen: string): Promise<BestMoveResult> {
    await this.ready
    if (!this.worker) {
      // Fallback: pick a random legal move synchronously
      const chess = new Chess(fen)
      const moves = chess.moves({ verbose: true })
      const m = moves[Math.floor(Math.random() * moves.length)]
      if (!m) throw new Error('No legal moves')
      return { from: m.from, to: m.to, san: m.san }
    }
    return new Promise(resolve => {
      this.worker!.onmessage = (e: MessageEvent<EngineResponse>) => {
        const d = e.data
        if (d.type === 'bestmove') {
          resolve({ from: d.from, to: d.to, san: d.san })
        }
      }
      const msg: EngineRequest = { type: 'bestmove', fen }
      this.worker!.postMessage(msg)
    })
  }
}

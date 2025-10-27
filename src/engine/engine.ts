import { Chess } from 'chess.js'
import EngineWorker from './engineWorker.ts?worker'
import type {
  BestMoveResponse,
  BestMoveResult,
  Difficulty,
  EnginePreset,
  EngineRequest,
  EngineResponse,
  ErrorResponse,
} from './types'

export type { Difficulty, BestMoveResult }

export const PRESETS: Record<Difficulty, EnginePreset> = {
  Beginner: { skill: 1, depth: 2, movetime: 150 },
  Casual: { skill: 5, depth: 6, movetime: 300 },
  Challenging: { skill: 10, depth: 10, movetime: 500 },
  Hard: { skill: 15, depth: 14, movetime: 800 },
  Insane: { skill: 20, depth: 18, movetime: 1200 },
}

class EngineRequestError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'EngineRequestError'
    this.code = code
  }
}

type PendingMove = {
  resolve: (result: BestMoveResult) => void
  reject: (reason: unknown) => void
}

export class Engine {
  public readonly ready: Promise<void>

  private readonly preset: EnginePreset
  private worker: Worker | null
  private readonly handleMessageBound: (event: MessageEvent<EngineResponse>) => void
  private resolveReady?: () => void
  private readyAcknowledged = false
  private pendingMove: PendingMove | null = null

  constructor(preset: Difficulty = 'Casual', _opts?: { chess960?: boolean }) {
    const presetConfig = PRESETS[preset]
    if (!presetConfig) {
      throw new Error(`Unknown difficulty preset "${preset}"`)
    }

    this.preset = presetConfig
    this.handleMessageBound = this.handleMessage.bind(this)

    try {
      this.worker = new (EngineWorker as unknown as new () => Worker)()
    } catch {
      this.worker = null
    }

    if (this.worker) {
      this.worker.onmessage = this.handleMessageBound
      this.ready = new Promise(resolve => {
        this.resolveReady = resolve
      })
    } else {
      this.ready = Promise.resolve()
      this.readyAcknowledged = true
    }
  }

  private handleMessage(event: MessageEvent<EngineResponse>) {
    const message = event.data
    if (!message || typeof message !== 'object') return

    switch (message.type) {
      case 'ready':
        this.handleReady()
        break
      case 'bestmove':
        this.handleBestMove(message)
        break
      case 'error':
        this.handleError(message)
        break
    }
  }

  private handleReady() {
    if (this.readyAcknowledged) return
    this.readyAcknowledged = true
    this.resolveReady?.()
    this.resolveReady = undefined
    this.sendPresetOptions()
  }

  private handleBestMove(message: BestMoveResponse) {
    if (!this.pendingMove) return
    const { from, to, san } = message
    this.pendingMove.resolve({ from, to, san })
    this.pendingMove = null
  }

  private handleError(message: ErrorResponse) {
    if (!this.pendingMove) return
    const err = new EngineRequestError(message.message, message.code)
    this.pendingMove.reject(err)
    this.pendingMove = null
  }

  private sendPresetOptions() {
    if (!this.worker) return
    const { skill, depth, movetime } = this.preset
    const payload: EngineRequest = { type: 'setoptions', skill, depth, movetime }
    this.worker.postMessage(payload)
  }

  private postMessage(payload: EngineRequest) {
    if (!this.worker) return
    this.worker.postMessage(payload)
  }

  async bestMove(fen: string): Promise<BestMoveResult> {
    if (!this.readyAcknowledged) {
      await this.ready
    }

    if (!this.worker) {
      const chess = new Chess(fen)
      const moves = chess.moves({ verbose: true })
      const choice = moves[Math.floor(Math.random() * moves.length)]
      if (!choice) {
        throw new EngineRequestError('No legal moves available', 'NO_MOVE')
      }
      return { from: choice.from, to: choice.to, san: choice.san }
    }

    if (this.pendingMove) {
      const err = new EngineRequestError('Engine request already in progress', 'IN_PROGRESS')
      return Promise.reject(err)
    }

    return new Promise<BestMoveResult>((resolve, reject) => {
      this.pendingMove = { resolve, reject }
      this.postMessage({ type: 'bestmove', fen })
    })
  }

  async newGame(): Promise<void> {
    if (!this.readyAcknowledged) {
      await this.ready
    }

    if (this.pendingMove) {
      const err = new EngineRequestError('Best move request cancelled by new game', 'CANCELLED')
      this.pendingMove.reject(err)
      this.pendingMove = null
    }

    this.postMessage({ type: 'newgame' })
  }
}

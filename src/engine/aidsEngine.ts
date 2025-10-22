import type { Square } from 'chess.js'
import type { AidsRequest, AidsResponse } from './aidsWorker'

export interface GameplayAids {
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

export class AidsEngine {
  private worker: Worker | null = null
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private ready: Promise<void>

  constructor() {
    if (typeof Worker !== 'undefined') {
      // Dynamic import for Vite worker
      this.ready = import('./aidsWorker.ts?worker')
        .then(module => {
          this.worker = new module.default()
        })
        .catch(() => {
          console.warn('Aids worker not available')
        })
    } else {
      this.ready = Promise.resolve()
    }
  }

  analyze(fen: string, callback: (aids: GameplayAids) => void): void {
    if (!this.worker) {
      this.ready.then(() => this.worker && this.analyze(fen, callback))
      return
    }

    // Debounce analysis requests
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.worker!.onmessage = (e: MessageEvent<AidsResponse>) => {
        const data = e.data
        if (data.type === 'analysis') {
          callback({
            bestMove: data.bestMove,
            captures: data.captures
          })
        }
      }

      const request: AidsRequest = {
        type: 'analyze',
        fen
      }

      this.worker!.postMessage(request)
    }, 300) // 300ms debounce
  }

  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

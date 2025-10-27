import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Chess } from 'chess.js'

type PostedMessage = { type: string; [key: string]: unknown }

class MockWorker {
  static instances: MockWorker[] = []
  public onmessage: ((event: MessageEvent<any>) => void) | null = null
  public posted: PostedMessage[] = []

  constructor() {
    MockWorker.instances.push(this)
  }

  postMessage(message: PostedMessage) {
    this.posted.push(message)
  }

  emit(data: any) {
    this.onmessage?.({ data } as MessageEvent<any>)
  }

  terminate() {
    // no-op for tests
  }
}

vi.mock('./engineWorker.ts?worker', () => ({ default: MockWorker }))

// Import after the mock
const { Engine } = await import('./engine')

describe('Engine ↔ worker handshake contract', () => {
  beforeEach(() => {
    MockWorker.instances.length = 0
  })

  it('waits for the worker ready event before sending requests', async () => {
    const engine = new Engine('Casual')
    const worker = MockWorker.instances.at(-1)!
    expect(worker.posted).toHaveLength(0)

    worker.emit({ type: 'ready' })

    const fen = new Chess().fen()
    const movePromise = engine.bestMove(fen)
    const bestmoveCall = worker.posted.find(msg => msg.type === 'bestmove')

    expect(bestmoveCall).toEqual({ type: 'bestmove', fen })
    worker.emit({ type: 'bestmove', from: 'a2', to: 'a3', san: 'a3' })
    await expect(movePromise).resolves.toEqual({ from: 'a2', to: 'a3', san: 'a3' })
  })

  it('rejects when the worker responds with an error payload', async () => {
    const engine = new Engine('Casual')
    const worker = MockWorker.instances.at(-1)!
    worker.emit({ type: 'ready' })

    const movePromise = engine.bestMove(new Chess().fen())
    worker.emit({ type: 'error', message: 'No move', code: 'NO_MOVE' })

    await expect(movePromise).rejects.toMatchObject({ message: 'No move' })
  })
})

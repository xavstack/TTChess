import { describe, it, expect, beforeAll } from 'vitest'
import type { Square } from 'chess.js'

const store: Record<string, string> = {}
// @ts-expect-error -- mock localStorage for tests
globalThis.localStorage = {
  getItem: (k: string) => (k in store ? store[k] : null),
  setItem: (k: string, v: string) => {
    store[k] = v
  },
}

let useGameStore: typeof import('./gameStore').useGameStore

beforeAll(async () => {
  ;({ useGameStore } = await import('./gameStore'))
})

describe('gameStore', () => {
  it('makes a legal move and updates boardVersion', async () => {
    const { chess } = useGameStore.getState()
    const before = chess.fen()
    const mv = chess.moves({ verbose: true })[0]
    if (!mv) throw new Error('No moves')
    await useGameStore.getState().makeMove(mv.from as Square, mv.to as Square)
    const after = useGameStore.getState().chess.fen()
    expect(after).not.toEqual(before)
  })
})

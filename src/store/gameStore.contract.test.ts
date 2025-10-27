import { beforeEach, describe, expect, it, vi } from 'vitest'

const bestMoveMock = vi.fn<[], Promise<never>>()

vi.mock('../engine/engine', () => {
  class MockEngine {
    async bestMove() {
      return bestMoveMock()
    }
    async newGame() {
      /* no-op */
    }
  }
  return { Engine: MockEngine }
})

const { useGameStore } = await import('./gameStore')

describe('gameStore engine error handling', () => {
  beforeEach(() => {
    bestMoveMock.mockReset()
    bestMoveMock.mockRejectedValue(Object.assign(new Error('No legal move'), { code: 'NO_MOVE' }))
    useGameStore.setState(state => {
      state.chess.reset()
      return state
    })
  })

  it('keeps state consistent when the engine reports NO_MOVE', async () => {
    const makeMove = useGameStore.getState().makeMove
    await expect(makeMove('e2', 'e4')).resolves.toBeUndefined()

    const history = useGameStore.getState().chess.history({ verbose: true })
    expect(history).toHaveLength(1)
    expect(useGameStore.getState().activeSide).toBeNull()
  })
})

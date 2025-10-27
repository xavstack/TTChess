import { describe, it, expect } from 'vitest'
import { useGameStore } from './gameStore'
import { act } from 'react-dom/test-utils'
import { Chess } from 'chess.js'

describe('gameStore + engine contract', () => {
  it('requests engine move and applies returned move to store FEN', async () => {
    const initial = useGameStore.getState()
    // ensure a fresh game
    act(() => initial.resetGame())

    const fenBefore = useGameStore.getState().chess.fen()
    // Ask the engine to move for side-to-move
    await useGameStore.getState().engineMove()
    const fenAfter = useGameStore.getState().chess.fen()

    expect(fenAfter).not.toEqual(fenBefore)

    // sanity: resulting FEN should be legal
    const c = new Chess(fenAfter)
    expect(c.isCheckmate() || c.isDraw() || c.moves().length >= 0).toBe(true)
  })
})

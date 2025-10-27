import { describe, it, expect } from 'vitest'
import { Engine } from './engine'
import { Chess } from 'chess.js'

/**
 * These tests validate the engine contract behaviors:
 * - ready handshake
 * - bestmove returns a legal move for a given FEN
 * - no hangs on positions with no legal moves
 */

const START_FEN = new Chess().fen()

describe('Engine integration', () => {
  it('emits ready and accepts commands', async () => {
    const engine = new Engine('Casual')
    await engine.ready
    await engine.newGame()
  })

  it('returns a legal bestmove for START position', async () => {
    const engine = new Engine('Casual')
    await engine.ready
    const best = await engine.bestMove(START_FEN)
    expect(best).toBeTruthy()
    const c = new Chess(START_FEN)
    const ok = c.move({ from: best.from, to: best.to, promotion: 'q' })
    expect(ok).not.toBeNull()
  })

  it('does not hang on positions with no legal moves', async () => {
    // Quick checkmate FEN (black to move & checkmated), no legal moves:
    // Fool's mate (after 1.f3 e5 2.g4 Qh4#) — black to move is illegal;
    // We'll craft a stalemate instead: K on a8, Q blocks… simpler:
    const STALEMATE_FEN = '7k/5Q2/7K/8/8/8/8/8 b - - 0 1' // no legal moves for black
    const engine = new Engine()
    await engine.ready
    let err: any = null
    try {
      await engine.bestMove(STALEMATE_FEN)
    } catch (e) {
      err = e
    }
    expect(err).toBeTruthy()
  })
})

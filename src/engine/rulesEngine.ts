import { Chess, type Move, type Square } from 'chess.js'

export type Variant = 'standard' | 'chess960' | 'kingOfTheHill' | 'threeCheck' | 'horde'

export interface RulesEngine {
  getFen(): string
  setFen(fen: string): void
  reset(): void
  moves(opts?: { verbose?: boolean; square?: Square }): Move[] | string[]
  move(m: { from: Square; to: Square; promotion?: 'q' | 'r' | 'b' | 'n' }): Move | null
  undo(): void
  isGameOver(): boolean
  inCheck(): boolean
  loadPgn(pgn: string): void
  pgn(): string
}

export class StandardRules implements RulesEngine {
  private impl: Chess
  constructor(fen?: string) {
    this.impl = new Chess(fen)
  }
  getFen(): string {
    return this.impl.fen()
  }
  setFen(fen: string): void {
    this.impl = new Chess(fen)
  }
  reset(): void {
    this.impl.reset()
  }
  moves(opts?: { verbose?: boolean; square?: Square }): Move[] | string[] {
    // chess.js types already align
    if (opts?.verbose) return this.impl.moves({ ...opts, verbose: true }) as Move[]
    return this.impl.moves()
  }
  move(m: { from: Square; to: Square; promotion?: 'q' | 'r' | 'b' | 'n' }): Move | null {
    return this.impl.move(m as { from: string; to: string; promotion?: string }) as Move | null
  }
  undo(): void {
    this.impl.undo()
  }
  isGameOver(): boolean {
    return this.impl.isGameOver()
  }
  inCheck(): boolean {
    return this.impl.inCheck()
  }
  loadPgn(pgn: string): void {
    this.impl.loadPgn(pgn)
  }
  pgn(): string {
    return this.impl.pgn()
  }
}

export function createRules(variant: Variant, initialFen?: string): RulesEngine {
  switch (variant) {
    case 'standard':
    case 'chess960':
      // For 960 we still use chess.js with provided FEN; enforcement of 960 starting
      // positions will be handled by supplying a valid FEN on new game.
      return new StandardRules(initialFen)
    case 'kingOfTheHill':
    case 'threeCheck':
    case 'horde':
    default:
      // Phase 1: human-vs-human only, reuse standard rules for basic move legality
      return new StandardRules(initialFen)
  }
}



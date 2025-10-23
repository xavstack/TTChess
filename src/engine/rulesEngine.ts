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

// Generate a valid Chess960 starting FEN (without castling rights for simplicity)
export function generateChess960StartFen(): string {
  const squares = Array.from({ length: 8 }, (_, i) => i)
  const darkSquares = [0, 2, 4, 6]
  const lightSquares = [1, 3, 5, 7]

  function take(arr: number[]): number {
    const idx = Math.floor(Math.random() * arr.length)
    const v = arr[idx]
    arr.splice(idx, 1)
    return v
  }

  const available = [...squares]
  const bishops: number[] = []
  // Place bishops on opposite colors
  const b1 = darkSquares[Math.floor(Math.random() * darkSquares.length)]
  bishops.push(b1)
  available.splice(available.indexOf(b1), 1)
  const lightAvail = lightSquares.filter(i => available.includes(i))
  const b2 = lightAvail[Math.floor(Math.random() * lightAvail.length)]
  bishops.push(b2)
  available.splice(available.indexOf(b2), 1)

  // Place queen
  const q = take(available)
  // Place knights
  const n1 = take(available)
  const n2 = take(available)
  // Remaining three squares are for R K R, king must be between rooks
  const remaining = available.sort((a, b) => a - b)
  const r1 = remaining[0]
  const k = remaining[1]
  const r2 = remaining[2]

  const back = Array(8).fill('') as string[]
  back[bishops[0]] = 'B'
  back[bishops[1]] = 'B'
  back[q] = 'Q'
  back[n1] = 'N'
  back[n2] = 'N'
  back[r1] = 'R'
  back[k] = 'K'
  back[r2] = 'R'

  const whiteBack = back.join('')
  const blackBack = whiteBack.toLowerCase()
  // No castling rights here ('-'); halfmove=0 fullmove=1
  return `${blackBack}/pppppppp/8/8/8/8/PPPPPPPP/${whiteBack} w - - 0 1`
}

export function createRules(variant: Variant, initialFen?: string): RulesEngine {
  switch (variant) {
    case 'standard':
      return new StandardRules(initialFen)
    case 'chess960':
      return new StandardRules(initialFen ?? generateChess960StartFen())
    case 'kingOfTheHill':
    case 'threeCheck':
    case 'horde':
    default:
      // Phase 1: human-vs-human only, reuse standard rules for basic move legality
      return new StandardRules(initialFen)
  }
}



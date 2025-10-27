/**
 * Type definitions for Engine Worker messaging protocol
 */

export type EngineRequest =
  | { type: 'setoptions'; skill?: number; depth?: number; movetime?: number }
  | { type: 'bestmove'; fen: string }
  | { type: 'newgame' }

export type ReadyResponse = { type: 'ready' }

export type BestMoveResponse = { type: 'bestmove'; san: string; from: string; to: string }

export type ErrorResponse = { type: 'error'; message: string; code?: string }

export type EngineResponse = ReadyResponse | BestMoveResponse | ErrorResponse

export type Difficulty = 'Beginner' | 'Casual' | 'Challenging' | 'Hard' | 'Insane'

export interface EnginePreset {
  skill: number
  depth: number
  movetime: number
}

export interface BestMoveResult {
  from: string
  to: string
  san: string
}

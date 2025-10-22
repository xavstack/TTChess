/**
 * Type definitions for Engine Worker messaging protocol
 */

export type EngineRequest =
  | { type: 'init'; skill: number; depth: number; movetime: number }
  | { type: 'bestmove'; fen: string }

export type EngineResponse =
  | { type: 'ready' }
  | { type: 'bestmove'; san: string; from: string; to: string }

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


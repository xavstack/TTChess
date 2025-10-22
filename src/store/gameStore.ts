import { create } from 'zustand'
import { Chess, type Move, type Square } from 'chess.js'
import { selectTrashTalk, type EffectiveTone } from '../trashTalk/selector'
import { speak, cancelSpeech } from '../trashTalk/tts'
import { toDatasetPiece } from '../utils/pieces'
import { Engine, type Difficulty } from '../engine/engine'

export type UiMove = {
  from: Square
  to: Square
  san: string
  piece: string
  capture?: boolean
  check?: boolean
}

type StoreState = {
  chess: Chess
  selected: Square | null
  legalTargets: Square[]
  lastTaunt: string | null
  tone: EffectiveTone
  boardVersion: number
  difficulty: Difficulty
  engine: Engine
  flipped: boolean
  timeWhiteMs: number
  timeBlackMs: number
  activeSide: 'w' | 'b' | null
  tauntEngineMoves: boolean // whether to generate taunts on AI moves
  selectSquare: (sq: Square | null) => void
  makeMove: (from: Square, to: Square) => void
  setTone: (tone: EffectiveTone) => void
  setDifficulty: (d: Difficulty) => void
  toggleFlip: () => void
  exportPgn: () => string
  importPgn: (text: string) => void
  undoPair: () => void
  setTauntEngineMoves: (enabled: boolean) => void
}

function getLegalTargets(chess: Chess, from: Square): Square[] {
  return chess.moves({ square: from, verbose: true }).map(m => m.to as Square)
}

function moveToUi(move: Move): UiMove {
  return {
    from: move.from as Square,
    to: move.to as Square,
    san: move.san,
    piece: move.piece, // chess.js piece letter
    capture: !!move.captured,
    check: move.san.includes('+') || move.san.includes('#'),
  }
}

function maybeTaunt(move: UiMove, tone: EffectiveTone): string | null {
  const text = selectTrashTalk(toDatasetPiece(move.piece), tone, {
    capture: move.capture,
    check: move.check,
  })
  if (text) speak(text)
  return text
}

export const useGameStore = create<StoreState>((set, get) => {
  const initial: StoreState = {
    chess: new Chess(),
    selected: null,
    legalTargets: [],
    lastTaunt: null,
    tone: ((): EffectiveTone => {
      const saved = localStorage.getItem('ttc_tone_v1')
      return saved === 'pg13' || saved === 'spicy' || saved === 'off'
        ? (saved as EffectiveTone)
        : 'pg13'
    })(),
    boardVersion: 0,
    difficulty: ((): Difficulty => {
      const saved = localStorage.getItem('ttc_difficulty_v1')
      return saved === 'Beginner' ||
        saved === 'Casual' ||
        saved === 'Challenging' ||
        saved === 'Hard' ||
        saved === 'Insane'
        ? (saved as Difficulty)
        : 'Casual'
    })(),
    engine: new Engine('Casual'),
    flipped: false,
    timeWhiteMs: 5 * 60 * 1000,
    timeBlackMs: 5 * 60 * 1000,
    activeSide: null,
    tauntEngineMoves: ((): boolean => {
      const saved = localStorage.getItem('ttc_taunt_engine_moves_v1')
      return saved === 'true' // default false
    })(),
    setTone: tone => {
      localStorage.setItem('ttc_tone_v1', tone)
      set({ tone })
    },
    setDifficulty: d => {
      localStorage.setItem('ttc_difficulty_v1', d)
      set({ difficulty: d, engine: new Engine(d) })
    },
    toggleFlip: () => set(s => ({ flipped: !s.flipped })),
    setTauntEngineMoves: enabled => {
      localStorage.setItem('ttc_taunt_engine_moves_v1', enabled ? 'true' : 'false')
      set({ tauntEngineMoves: enabled })
    },
    selectSquare: sq => {
      const { chess } = get()
      if (!sq) {
        set({ selected: null, legalTargets: [] })
        return
      }
      const targets = getLegalTargets(chess, sq)
      set({ selected: sq, legalTargets: targets })
    },
    makeMove: async (from, to) => {
      const { chess, tone, engine, activeSide, tauntEngineMoves } = get()

      const move = chess.move({ from, to, promotion: 'q' })
      if (!move) return

      // Start clock on first human move
      if (activeSide === null) set({ activeSide: 'b' })

      cancelSpeech() // cancel if a previous line is mid-utterance
      const uiMove = moveToUi(move)

      const taunt = maybeTaunt(uiMove, tone)
      set({
        selected: null,
        legalTargets: [],
        lastTaunt: taunt ?? null,
        boardVersion: Math.random(),
      })

      // If game over, stop
      if (chess.isGameOver()) {
        set({ activeSide: null })
        return
      }

      // Engine reply using worker; clock switches back to white after engine moves
      const best = await engine.bestMove(chess.fen())
      const reply = chess.move({ from: best.from as Square, to: best.to as Square, promotion: 'q' })
      if (!reply) return
      const uiReply = moveToUi(reply)
      const taunt2 = tauntEngineMoves ? maybeTaunt(uiReply, tone) : null
      set({ lastTaunt: taunt2 ?? null, boardVersion: Math.random(), activeSide: 'b' })
      // Immediately give turn back to human
      set({ activeSide: 'w' })
      if (chess.isGameOver()) set({ activeSide: null })
    },
    exportPgn: () => get().chess.pgn(),
    importPgn: (text: string) => {
      const c = get().chess
      c.reset()
      c.loadPgn(text)
      set({ boardVersion: Math.random() })
    },
    undoPair: () => {
      const c = get().chess
      c.undo()
      c.undo()
      set({ boardVersion: Math.random() })
    },
  }

  // Clock ticking interval (guarded and throttled)
  // Only update store when the displayed whole second changes to reduce re-render churn
  ;(function startClockTicker() {
    const g: any = globalThis as any
    if (g.__ttcClockTimer) clearInterval(g.__ttcClockTimer)
    const TICK_MS = 250
    g.__ttcClockTimer = setInterval(() => {
      const { activeSide, timeWhiteMs, timeBlackMs, chess } = get()
      if (!activeSide) return
      if (chess.isGameOver()) {
        set({ activeSide: null })
        return
      }

      if (activeSide === 'w') {
        const next = Math.max(0, timeWhiteMs - TICK_MS)
        if (Math.floor(next / 1000) !== Math.floor(timeWhiteMs / 1000) || next === 0) {
          set({ timeWhiteMs: next })
          if (next === 0) set({ activeSide: null })
        }
      } else {
        const next = Math.max(0, timeBlackMs - TICK_MS)
        if (Math.floor(next / 1000) !== Math.floor(timeBlackMs / 1000) || next === 0) {
          set({ timeBlackMs: next })
          if (next === 0) set({ activeSide: null })
        }
      }
    }, TICK_MS)
  })()

  return initial
})

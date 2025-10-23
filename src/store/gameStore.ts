import { create } from 'zustand'
import { Chess, type Move, type Square } from 'chess.js'
import { selectTrashTalk, type EffectiveTone } from '../trashTalk/selector'
import { speak, cancelSpeech } from '../trashTalk/tts'
import { toDatasetPiece } from '../utils/pieces'
import { Engine, type Difficulty } from '../engine/engine'
import { createRules, type Variant } from '../engine/rulesEngine'
import { AidsEngine, type GameplayAids } from '../engine/aidsEngine'
import type { PieceSet } from '../utils/pieceSets'

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
  variant: Variant
  setVariant: (v: Variant) => void
  isEngineAvailable: boolean
  showCoordinates: boolean
  setShowCoordinates: (show: boolean) => void
  boardTheme: string
  setBoardTheme: (theme: string) => void
  showAids: boolean
  setShowAids: (show: boolean) => void
  aids: GameplayAids
  setActiveSide: (side: 'w' | 'b' | null) => void
  pieceSet: PieceSet
  setPieceSet: (set: PieceSet) => void
  tauntEngineMoves: boolean
  setTauntEngineMoves: (enabled: boolean) => void
  selectSquare: (sq: Square | null) => void
  makeMove: (from: Square, to: Square) => void
  setTone: (tone: EffectiveTone) => void
  setDifficulty: (d: Difficulty) => void
  toggleFlip: () => void
  exportPgn: () => string
  importPgn: (text: string) => void
  undoPair: () => void
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
  const aidsEngine = new AidsEngine()
  
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
    variant: ((): Variant => {
      const saved = localStorage.getItem('ttc_variant_v1') as Variant | null
      return saved ?? 'standard'
    })(),
    setVariant: (v: Variant) => {
      localStorage.setItem('ttc_variant_v1', v)
      const rules = createRules(v)
      const fen = rules.getFen()
      const engineAvailable = v === 'standard' || v === 'chess960'
      // Recreate engine with chess960 flag when needed (per UCI docs, Chess960 has special castling rules)
      const currentDifficulty = get().difficulty
      const engine = new Engine(currentDifficulty, { chess960: v === 'chess960' })
      engine.newGame().catch(() => {})
      set({
        variant: v,
        chess: new Chess(fen),
        engine,
        isEngineAvailable: engineAvailable,
        boardVersion: Math.random(),
        activeSide: null,
      })
    },
    isEngineAvailable: ((): boolean => {
      const saved = localStorage.getItem('ttc_variant_v1') as Variant | null
      const variant = saved ?? 'standard'
      return variant === 'standard' || variant === 'chess960'
    })(),
    showCoordinates: ((): boolean => {
      const saved = localStorage.getItem('ttc_show_coordinates_v1')
      return saved === 'true'
    })(),
    setShowCoordinates: (show: boolean) => {
      localStorage.setItem('ttc_show_coordinates_v1', show ? 'true' : 'false')
      set({ showCoordinates: show })
    },
    boardTheme: ((): string => {
      const saved = localStorage.getItem('ttc_board_theme_v1')
      return saved || 'classic-green'
    })(),
    setBoardTheme: (theme: string) => {
      localStorage.setItem('ttc_board_theme_v1', theme)
      // Apply theme to document
      document.documentElement.className = document.documentElement.className
        .replace(/board-\w+/g, '')
        .trim() + ` board-${theme}`
      set({ boardTheme: theme })
    },
    showAids: ((): boolean => {
      const saved = localStorage.getItem('ttc_show_aids_v1')
      return saved === 'true'
    })(),
    setShowAids: (show: boolean) => {
      localStorage.setItem('ttc_show_aids_v1', show ? 'true' : 'false')
      set({ showAids: show })
      if (show) {
        const { chess } = get()
        aidsEngine.analyze(chess.fen(), (aids) => set({ aids }))
      } else {
        set({ aids: { captures: [] } })
      }
    },
    aids: { captures: [] },
    setActiveSide: (side: 'w' | 'b' | null) => {
      set({ activeSide: side })
    },
    pieceSet: ((): PieceSet => {
      const saved = localStorage.getItem('ttc_piece_set_v1') as PieceSet | null
      return saved || 'cburnett'
    })(),
    setPieceSet: (pieceSet: PieceSet) => {
      localStorage.setItem('ttc_piece_set_v1', pieceSet)
      set({ pieceSet })
    },
    tauntEngineMoves: ((): boolean => {
      const saved = localStorage.getItem('ttc_taunt_engine_moves_v1')
      return saved === 'true' // default false
    })(),
    setTauntEngineMoves: enabled => {
      localStorage.setItem('ttc_taunt_engine_moves_v1', enabled ? 'true' : 'false')
      set({ tauntEngineMoves: enabled })
    },
    setTone: tone => {
      localStorage.setItem('ttc_tone_v1', tone)
      set({ tone })
    },
    setDifficulty: d => {
      localStorage.setItem('ttc_difficulty_v1', d)
      const v = get().variant
      const engine = new Engine(d, { chess960: v === 'chess960' })
      engine.newGame().catch(() => {})
      set({ difficulty: d, engine })
    },
    toggleFlip: () => set(s => ({ flipped: !s.flipped })),
    selectSquare: sq => {
      const { chess, showAids } = get()
      if (!sq) {
        set({ selected: null, legalTargets: [] })
        return
      }
      const targets = getLegalTargets(chess, sq)
      set({ selected: sq, legalTargets: targets })

      // Update aids when square is selected
      if (showAids) {
        aidsEngine.analyze(chess.fen(), (aids) => set({ aids }))
      }
    },
    makeMove: async (from, to) => {
      const { chess, tone, engine, activeSide, tauntEngineMoves, isEngineAvailable } = get()

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

      // If game over, stop and trigger game end modal via App effect
      if (chess.isGameOver()) {
        set({ activeSide: null })
        return
      }

      // Engine reply only if available for this variant
      if (isEngineAvailable) {
        const best = await engine.bestMove(chess.fen())
        const reply = chess.move({ from: best.from as Square, to: best.to as Square, promotion: 'q' })
        if (!reply) return
        const uiReply = moveToUi(reply)
        const taunt2 = tauntEngineMoves ? maybeTaunt(uiReply, tone) : null
        set({ lastTaunt: taunt2 ?? null, boardVersion: Math.random(), activeSide: 'b' })
        // Immediately give turn back to human
        set({ activeSide: 'w' })
        if (chess.isGameOver()) set({ activeSide: null })
      } else {
        // Human vs Human mode - just switch sides
        set({ activeSide: activeSide === 'w' ? 'b' : 'w' })
      }

      // Refresh aids after any move
      if (get().showAids) {
        aidsEngine.analyze(get().chess.fen(), (aids) => set({ aids }))
      }
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

  // Clock ticking interval (guarded)
  ;(function startClockTicker() {
    const g = globalThis as typeof globalThis & {
      __ttcClockTimer?: ReturnType<typeof setInterval>
    }
    if (g.__ttcClockTimer) clearInterval(g.__ttcClockTimer)
    // Use 1000ms ticks for visible, predictable countdown
    const TICK_MS = 1000
    g.__ttcClockTimer = setInterval(() => {
      const { activeSide, timeWhiteMs, timeBlackMs, chess } = get()
      if (!activeSide) return
      if (chess.isGameOver()) {
        set({ activeSide: null })
        return
      }

      if (activeSide === 'w') {
        const next = Math.max(0, timeWhiteMs - TICK_MS)
        set({ timeWhiteMs: next })
        if (next === 0) set({ activeSide: null })
      } else {
        const next = Math.max(0, timeBlackMs - TICK_MS)
        set({ timeBlackMs: next })
        if (next === 0) set({ activeSide: null })
      }
    }, TICK_MS)
  })()

  return initial
})
